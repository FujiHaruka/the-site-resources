/**
 * @class TheProfileResource
 * @augments Resource
 */
'use strict'

const {TheError} = require('the-error')
const {
  DataTypes: {BOOLEAN, ENTITY, REF, STRING},
  TheResource,
} = require('the-resource-base')

const UnknownEmailError = TheError.withName('UnknownEmailError')

/** @lends TheProfileResource */
class TheProfileResource extends TheResource {

  static get policy () {
    return {
      email: {
        description: 'Email of user',
        trim: true,
        type: STRING,
        unique: true,
      },
      emailVerified: {
        default: () => false,
        description: 'Email has verified or not',
        type: BOOLEAN,
      },
      image: {
        description: 'Profile image',
        type: STRING,
      },
      name: {
        description: 'Display Name',
        trim: true,
        type: STRING,
      },
      user: {
        description: 'User',
        required: true,
        type: [ENTITY, REF],
        unique: true,
      },
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

  async assertEmailExists (email) {
    const Profile = this
    const profile = await Profile.first({email})
    if (!profile) {
      throw new UnknownEmailError(`Unknown email: ${email}`)
    }
  }

  async ofUser (user) {
    const Profile = this
    return Profile.of({user})
  }

  async userWithEmail (email) {
    const Profile = this
    const profile = await Profile.first({email})
    return profile ? profile.user : null
  }
}

Object.assign(TheProfileResource, {})

module.exports = TheProfileResource
