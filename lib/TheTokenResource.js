/**
 * @class TheTokenResource
 * @augments Resource
 */
'use strict'

const crypto = require('crypto')
const {
  DataTypes: {DATE, ENTITY, REF, STRING, OBJECT},
  TheResource,
} = require('the-resource-base')
const {TheError} = require('the-error')

const InvalidTokenError = TheError.withName('InvalidTokenError')
const theCache = require('the-cache').default
const newToken = () => crypto.randomBytes(12).toString('hex')

/** @lends TheTokenResource */
class TheTokenResource extends TheResource {
  constructor (...args) {
    super(...args)
    this.cache = theCache({
      max: 1000,
      maxAge: 1000 * 60 * 60
    })
  }

  /**
   * Verify token
   * @param {string} token - Token text
   * @throws {InvalidTokenError}
   * @returns {Promise<TheTokenResourceEntity>} Detected token
   */
  async verify (token) {
    const found = this.cache.get(token) || await this.first({token})
    if (!found) {
      throw new InvalidTokenError('Token not found')
    }
    this.cache.set({token: found})
    return found
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

  static get policy () {
    return {
      createdAt: {
        default: () => new Date(),
        description: 'Created date',
        type: DATE,
      },
      token: {
        default: () => newToken(),
        description: 'Token value',
        required: true,
        type: STRING,
        unique: true,
      },
      info: {
        description: 'Additional info',
        type: OBJECT,
        default: () => ({}),
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

}

module.exports = TheTokenResource
