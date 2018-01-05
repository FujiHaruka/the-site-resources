/**
 * Resources for site
 * @module the-site-resources
 */
'use strict'

const TheAliasResource = require('./TheAliasResource')
const TheRoleResource = require('./TheRoleResource')
const TheSignResource = require('./TheSignResource')
const TheUserResource = require('./TheUserResource')

module.exports = {
  TheAliasResource,
  TheRoleResource,
  TheSignResource,
  TheUserResource
}

exports.TheAliasResource = TheAliasResource
exports.TheRoleResource = TheRoleResource
exports.TheSignResource = TheSignResource
exports.TheUserResource = TheUserResource
