/**
 * @class TheRoleResource
 * @augments Resource
 */
'use strict'

const {
  DataTypes: {STRING},
  TheResource,
} = require('the-resource-base')

/** @lends TheRoleResource */
class TheRoleResource extends TheResource {

  static get codes () {
    throw new Error('Not implemented')
  }

  static get policy () {
    return {
      code: {
        description: 'Role code',
        oneOf: Object.values(this.codes),
        required: true,
        type: STRING,
      },
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheRoleResourceEntity extends ResourceEntity {
    }

    return TheRoleResourceEntity
  }

  async ofCode (code) {
    const Role = this
    return Role.of({code})
  }
}

Object.assign(TheRoleResource, {})

module.exports = TheRoleResource
