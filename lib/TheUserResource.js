/**
 * @class TheUserResource
 * @augments Resource
 */
'use strict'

const {
  TheResource,
  DataTypes: {STRING, ENTITY, DATE, REF},
} = require('the-resource-base')
const {TheGoneError} = require('the-error')

/** @lends TheUserResource */
class TheUserResource extends TheResource {

  async assertUserNotGone (userId) {
    const User = this
    const user = await User.one(userId)
    if (!user) {
      throw new TheGoneError('User already gone')
    }
  }

  static inbound (attributes) {
    delete attributes.displayName
    delete attributes.displayImage
    return attributes
  }

  static outbound (attributes) {
    const {profile, name} = attributes
    attributes.displayName = (profile && profile.name) || name || 'Anonymous'
    attributes.displayImage = (profile && profile.image) || null
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
        type: [ENTITY, REF],
      },
      sign: {
        description: 'User sign',
        type: [ENTITY, REF],
      },
      role: {
        description: 'User Role',
        type: [ENTITY, REF],
      },
      createdAt: {
        description: 'Created date',
        type: DATE,
        default: () => new Date(),
      },
    }
  }

  static get indices () {
    return ['profile.name', 'profile.email', 'sign.signInAt', 'sign.signUpAt']
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
        delete user.sign
        return user
      }
    }

    return TheUserResourceEntity
  }
}

Object.assign(TheUserResource, {})

module.exports = TheUserResource
