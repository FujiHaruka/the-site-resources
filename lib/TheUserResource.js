/**
 * @class TheUserResource
 * @augments Resource
 */
'use strict'

const {Resource, DataTypes} = require('the-db')
const {STRING, ENTITY, DATE, REF} = DataTypes
const {TheGoneError} = require('the-error')

/** @lends TheUserResource */
class TheUserResource extends Resource {

  async assertUserNotGone (userId) {
    const User = this
    const user = await User.one(userId)
    if (!user) {
      throw new TheGoneError('User already gone')
    }
  }

  static inbound (attributes) {
    delete attributes.displayName
    return attributes
  }

  static outbound (attributes) {
    const {profile, name} = attributes
    attributes.displayName = (profile && profile.name) || name || 'Anonymous'
    return attributes
  }

  static get policy () {
    return {
      name: {
        description: 'Name of resource',
        type: STRING,
        unique: true,
        required: true,
        trim: true,
        minLength: 2,
        pattern: /^[a-z0-9_\-@]*$/,
      },
      profile: {
        description: 'User profile',
        type: [ENTITY, REF]
      },
      role: {
        description: 'User Role',
        type: [ENTITY, REF]
      },
      createdAt: {
        description: 'Created date',
        type: DATE,
        default: () => new Date()
      }
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheUserResourceEntity extends ResourceEntity {
      hasRoleOf (code) {
        const user = this
        const {role} = user
        return role && role.code === code
      }

      asPublic () {
        const user = this
        const {profile} = user
        if (profile) {
          profile.email = 'xxxxxxxxxxx'
        }
        return user
      }
    }

    return TheUserResourceEntity
  }
}

Object.assign(TheUserResource, {})

module.exports = TheUserResource
