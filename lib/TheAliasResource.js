/**
 * Resource for URL alias
 * @class TheAliasResource
 */
'use strict'

const {
  TheResource,
  DataTypes: {STRING}
} = require('the-resource-base')

const {format: formatUrl, parse: parseUrl} = require('url')
const uuid = require('uuid')
const numeral = require('numeral')
const path = require('path')
const {resolveUrl} = require('the-site-util')

/** @lends TheAliasResource */
class TheAliasResource extends TheResource {
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
    const key = await Alias.generateKey() + path.extname(parseUrl(originalUrl).pathname)
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
        description: 'Alias key',
      },
      originalUrl: {
        type: STRING,
        required: true,
        unique: true,
        description: 'Original path of alias',
      },
      pathname: {
        type: STRING,
        required: true,
        unique: true,
        description: 'Shortened pathname',
      },
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
