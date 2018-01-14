/**
 * @class TheProfileResource
 * @augments Resource
 */
'use strict'

const {TheError} = require('the-error')
const {
  TheResource,
  DataTypes: {STRING, ENTITY, BOOLEAN, REF},
} = require('the-resource-base')

const UnknownEmailError = TheError.withName('UnknownEmailError')

/** @lends TheProfileResource */
class TheProfileResource extends TheResource {

  async ofUser (user) {
    const Profile = this
    return Profile.of({user})
  }

  async userWithEmail (email) {
    const Profile = this
    const profile = await Profile.first({email})
    return profile ? profile.user : null
  }

  async assertEmailExists (email) {
    const Profile = this
    const profile = await Profile.first({email})
    if (!profile) {
      throw new UnknownEmailError(`Unknown email: ${email}`)
    }
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

      async update (attributes, options = {}) {
        const profile = this
        const {email} = attributes
        const needsVerify = email && (email !== profile.email)
        if (needsVerify) {
          attributes.emailVerified = false
        }
        return super.update(Object.assign({}, attributes), options)
      }
    }

    return TheProfileResourceEntity
  }
}

Object.assign(TheProfileResource, {})

module.exports = TheProfileResource