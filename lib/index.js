/**
 * Resources for site
 * @module the-site-resources
 */
'use strict'

const TheAliasResource = require('./TheAliasResource')
const TheSignResource = require('./TheSignResource')
const mixins = require('./mixins')

module.exports = {
  TheAliasResource,
  TheSignResource,
  mixins
}

exports.TheAliasResource = TheAliasResource
exports.TheSignResource = TheSignResource
exports.mixins = mixins
