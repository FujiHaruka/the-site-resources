/**
 * @class TheRoleResource
 * @augments Resource
 */
'use strict'

const {
  TheResource,
  DataTypes: {STRING},
} = require('the-resource-base')

/** @lends TheRoleResource */
class TheRoleResource extends TheResource {

  async ofCode (code) {
    const Role = this
    return Role.of({code})
  }

  static get codes () {
    throw new Error('Not implemented')
  }

  static get policy () {
    return {
      code: {
        description: 'Role code',
        type: STRING,
        oneOf: Object.values(this.codes),
        required: true
      }
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheRoleResourceEntity extends ResourceEntity {
    }

    return TheRoleResourceEntity
  }
}

Object.assign(TheRoleResource, {})

module.exports = TheRoleResource