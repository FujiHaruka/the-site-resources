/**
 * Resources for site
 * @module the-site-resources
 */
'use strict'

const _d = (m) => 'default' in m ? m.default : m

const TheAliasResource = _d(require('./TheAliasResource'))
const TheProfileResource = _d(require('./TheProfileResource'))
const TheRoleResource = _d(require('./TheRoleResource'))
const TheSignResource = _d(require('./TheSignResource'))
const TheUserResource = _d(require('./TheUserResource'))

module.exports = {
  TheAliasResource,
  TheProfileResource,
  TheRoleResource,
  TheSignResource,
  TheUserResource,
}
