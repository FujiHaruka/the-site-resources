/**
 * @class TheUserResource
 * @augments Resource
 */
'use strict'

const {TheGoneError} = require('the-error')
const {
  DataTypes: {DATE, ENTITY, REF, STRING},
  TheResource,
} = require('the-resource-base')

/** @lends TheUserResource */
class TheUserResource extends TheResource {

  static get indices () {
    return ['profile.name', 'profile.email', 'sign.signInAt', 'sign.signUpAt', 'role.code']
  }

  static get policy () {
    return {
      createdAt: {
        default: () => new Date(),
        description: 'Created date',
        type: DATE,
      },
      lang: {
        default: () => 'en',
        description: 'User language',
        type: [STRING],
      },
      name: {
        description: 'Name of resource',
        minLength: 2,
        pattern: /^[a-z0-9_\-@]*$/,
        required: true,
        trim: true,
        type: STRING,
        unique: true,
      },
      profile: {
        description: 'User profile',
        type: [ENTITY, REF],
      },
      role: {
        description: 'User Role',
        type: [ENTITY, REF],
      },
      sign: {
        description: 'User sign',
        type: [ENTITY, REF],
      },
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheUserResourceEntity extends ResourceEntity {
      asPublic () {
        const user = this
        const {profile} = user
        if (profile) {
          user.profile = {
            ...profile,
            email: 'xxxxxxxxxxx',
          }
        }
        delete user.sign
        return user
      }

      hasRoleOf (code) {
        const user = this
        const {role} = user
        return role && role.code === code
      }
    }

    return TheUserResourceEntity
  }

  static inbound (attributes) {
    delete attributes.displayName
    delete attributes.displayImage
    return attributes
  }

  static outbound (attributes) {
    const {name, profile} = attributes
    attributes.displayName = (profile && profile.name) || name || 'Anonymous'
    attributes.displayImage = (profile && profile.image) || null
    return attributes
  }

  async assertUserNotGone (userId) {
    const User = this
    const user = await User.one(userId)
    if (!user) {
      throw new TheGoneError('User already gone')
    }
  }
}

Object.assign(TheUserResource, {})

module.exports = TheUserResource
