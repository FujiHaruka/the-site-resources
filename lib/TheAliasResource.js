/**
 * Resource for URL alias
 * @class TheAliasResource
 */
'use strict'

const numeral = require('numeral')
const path = require('path')
const {
  DataTypes: {STRING},
  TheResource,
} = require('the-resource-base')
const {resolveUrl} = require('the-site-util')
const {format: formatUrl, parse: parseUrl} = require('url')
const uuid = require('uuid')

/** @lends TheAliasResource */
class TheAliasResource extends TheResource {
  static get policy () {
    return {
      key: {
        description: 'Alias key',
        required: true,
        type: STRING,
        unique: true,
      },
      originalUrl: {
        description: 'Original path of alias',
        required: true,
        type: STRING,
        unique: true,
      },
      pathname: {
        description: 'Shortened pathname',
        required: true,
        type: STRING,
        unique: true,
      },
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheAliasResourceEntity extends ResourceEntity {
      urlFor (options = {}) {
        const alias = this
        const {
          host = 'localhost',
          protocol = 'http',
          query = {},
        } = options
        return formatUrl({
          host,
          pathname: alias.pathname,
          protocol,
          query,
        })
      }
    }

    return TheAliasResourceEntity
  }

  get pathnameFormat () {
    return '/a/:key'
  }

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
      key,
      originalUrl,
      pathname: resolveUrl(Alias.pathnameFormat, {key}),
    })
  }
}

Object.assign(TheAliasResource, {})

module.exports = TheAliasResource
