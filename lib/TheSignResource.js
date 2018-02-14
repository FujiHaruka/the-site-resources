/**
 * @class TheSignResource
 * @augments Resource
 */
'use strict'

const thePassword = require('the-password').default
const {
  DataTypes: {DATE, ENTITY, REF, STRING},
  TheResource,
} = require('the-resource-base')

const {digest: digestPassword, generatePassword, generateSalt} = thePassword()

/** @lends TheSignResource */
class TheSignResource extends TheResource {

  static get policy () {
    return {
      passwordHash: {
        default: () => digestPassword(generatePassword(), generateSalt()),
        description: 'Password hash of user',
        minLength: 2,
        required: true,
        type: STRING,
      },
      passwordSalt: {
        default: () => generateSalt(),
        description: 'Password salt',
        minLength: 2,
        required: true,
        type: STRING,
      },
      signInAt: {
        description: 'Last time signed in',
        type: DATE,
      },
      signOutAt: {
        description: 'Last time signed out',
        type: DATE,
      },
      signUpAt: {
        default: () => new Date(),
        description: 'Date of signing up',
        type: DATE,
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
    class TheSignResourceEntity extends ResourceEntity {
      verifyPassword (password) {
        const s = this
        const {passwordHash, passwordSalt} = s
        return passwordHash === digestPassword(password, passwordSalt)
      }
    }

    return TheSignResourceEntity
  }

  async ofUser (user) {
    const Sign = this
    return Sign.of({user})
  }

  async resetPasswordForUser (user) {
    const Sign = this
    const password = generatePassword()
    await Sign.setUserPassword(user, password)
    return password
  }

  async setUserPassword (user, password) {
    const Sign = this
    const sign = await Sign.of({user})
    const salt = generateSalt()
    return await sign.update({
      passwordHash: digestPassword(password, salt),
      passwordSalt: salt,
    })
  }
}

Object.assign(TheSignResource, {})

module.exports = TheSignResource
