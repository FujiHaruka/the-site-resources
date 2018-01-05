/**
 * @class TheProfileResource
 * @augments Resource
 */
'use strict'

const {Resource, DataTypes} = require('the-db')
const {STRING, ENTITY, BOOLEAN, REF} = DataTypes

/** @lends TheProfileResource */
class TheProfileResource extends Resource {

  async userWithEmail (email) {
    const Profile = this
    const profile = await Profile.first({email})
    return profile ? profile.user : null
  }

  static get policy () {
    return {
      name: {
        description: 'Display Name',
        type: STRING,
        trim: true
      },
      email: {
        description: 'Email of user',
        type: STRING,
        unique: true,
        trim: true
      },
      emailVerified: {
        description: 'Email has verified or not',
        type: BOOLEAN,
        default: () => false
      },
      image: {
        description: 'Profile image',
        type: STRING
      },
      user: {
        description: 'User',
        type: [ENTITY, REF],
        required: true,
        unique: true
      }
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheProfileResourceEntity extends ResourceEntity {

      get isEmailVerifyNeeded () {
        const profile = this
        return Boolean(profile.email && !profile.emailVerified)
      }
    }

    return TheProfileResourceEntity
  }
}

Object.assign(TheProfileResource, {})

module.exports = TheProfileResource