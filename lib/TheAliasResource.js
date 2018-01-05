/**
 * Resource for URL alias
 * @class TheAliasResource
 */
'use strict'

const {Resource, DataTypes} = require('the-db')
const {STRING} = DataTypes
const {format: formatUrl} = require('url')
const uuid = require('uuid')
const numeral = require('numeral')
const {resolveUrl} = require('the-site-util')

/** @lends TheAliasResource */
class TheAliasResource extends Resource {
  async generateKey () {
    const Alias = this
    const num = (await Alias.count()) + 1
    return uuid.v4().split('-').pop() + numeral(num).format('000')
  }

  async ofUrl (originalUrl) {
    const Alias = this
    const found = await Alias.first({originalUrl})
    if (found) {
      return found
    }
    const key = await Alias.generateKey()
    return Alias.create({
      originalUrl,
      key,
      pathname: resolveUrl(Alias.pathnameFormat, {key})
    })
  }

  get pathnameFormat () {
    return '/a/:key'
  }

  static get policy () {
    return {
      key: {
        type: STRING,
        required: true,
        unique: true,
        description: 'Alias key'
      },
      originalUrl: {
        type: STRING,
        required: true,
        unique: true,
        description: 'Original path of alias'
      },
      pathname: {
        type: STRING,
        required: true,
        unique: true,
        description: 'Shortened pathname'
      }
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheAliasResourceEntity extends ResourceEntity {
      urlFor (options = {}) {
        const alias = this
        const {
          protocol = 'http',
          host = 'localhost',
          query = {}
        } = options
        return formatUrl({
          protocol,
          host,
          pathname: alias.pathname,
          query
        })
      }
    }

    return TheAliasResourceEntity
  }
}

Object.assign(TheAliasResource, {})

module.exports = TheAliasResource
