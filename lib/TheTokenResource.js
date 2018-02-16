/**
 * @class TheTokenResource
 * @augments Resource
 */
'use strict'

const crypto = require('crypto')
const theCache = require('the-cache').default
const {unlessProduction} = require('the-check')
const {TheError} = require('the-error')
const uuid = require('uuid')
const {
  DataTypes: {DATE, ENTITY, OBJECT, REF, STRING},
  TheResource,
} = require('the-resource-base')
const InvalidTokenError = TheError.withName('InvalidTokenError', {status: 401})
const TokenRequiredError = TheError.withName('TokenRequiredError', {status: 401})
const newToken = () => crypto.randomBytes(12).toString('hex')

/** @lends TheTokenResource */
class TheTokenResource extends TheResource {
  static get policy () {
    return {
      key: {
        default: () => uuid.v4(),
        description: 'Key of resource',
        required: true,
        type: STRING,
      },
      createdAt: {
        default: () => new Date(),
        description: 'Created date',
        type: DATE,
      },
      info: {
        default: () => ({}),
        description: 'Additional info',
        type: OBJECT,
      },
      token: {
        default: () => newToken(),
        description: 'Token value',
        required: true,
        type: STRING,
        unique: true,
      },
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheTokenResourceEntity extends ResourceEntity {
      /**
       * Renew token text
       * @returns {Promise<void>}
       */
      async renew () {
        this.token = newToken()
        await this.save()
      }
    }

    return TheTokenResourceEntity
  }

  constructor (...args) {
    super(...args)
    this.cache = theCache({
      max: 1000,
      maxAge: 1000 * 60 * 60,
    })
  }

  /**
   * Verify and renew token
   * @returns {Promise<TheTokenResourceEntity>}
   */
  async consume (token) {
    const found = await this.verify(token)
    const old = found.token
    await found.renew()
    this.cache.del(old)
    return found
  }

  /**
   * Verify token
   * @param {string} token - Token text
   * @throws {InvalidTokenError}
   * @returns {Promise<TheTokenResourceEntity>} Detected token
   */
  async verify (token) {
    if (!token) {
      throw new TokenRequiredError('Token is required')
    }
    unlessProduction(() => {
      if (typeof token !== 'string') {
        throw new Error(`[TheTokenResource] token must be string`)
      }
    })
    const found = this.cache.get(token) || await this.first({token})
    if (!found) {
      throw new InvalidTokenError('Token not found')
    }
    this.cache.set({token: found})
    return found
  }

}

module.exports = TheTokenResource
