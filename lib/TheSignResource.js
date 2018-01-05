/**
 * @class TheSignResource
 * @augments Resource
 */
'use strict'

const {Resource, DataTypes} = require('the-db')
const {STRING, ENTITY, DATE} = DataTypes
const thePassword = require('the-password')
const {generateSalt, generatePassword, digest: digestPassword} = thePassword()

/** @lends TheSignResource */
class TheSignResource extends Resource {
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
      passwordSalt: salt,
      passwordHash: digestPassword(password, salt)
    })
  }

  static get policy () {
    return {
      passwordSalt: {
        description: 'Password salt',
        type: STRING,
        required: true,
        minLength: 2,
        default: () => generateSalt()
      },
      passwordHash: {
        description: 'Password hash of user',
        type: STRING,
        required: true,
        minLength: 2,
        default: () => digestPassword(generatePassword(), generateSalt())
      },
      signUpAt: {
        description: 'Date of signing up',
        type: DATE,
        default: () => new Date()
      },
      signInAt: {
        description: 'Last time signed in',
        type: DATE
      },
      signOutAt: {
        description: 'Last time signed out',
        type: DATE
      },
      user: {
        description: 'User',
        type: ENTITY,
        required: true,
        unique: true
      }
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheSignResourceEntity extends ResourceEntity {
      verifyPassword (password) {
        const s = this
        const {passwordSalt, passwordHash} = s
        return passwordHash === digestPassword(password, passwordSalt)
      }
    }

    return TheSignResourceEntity
  }
}

Object.assign(TheSignResource, {})

module.exports = TheSignResource