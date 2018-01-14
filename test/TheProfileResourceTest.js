/**
 * Test for TheProfileResource.
 * Runs with mocha.
 */
'use strict'

const TheProfileResource = require('../lib/TheProfileResource')
const TheUserResource = require('../lib/TheUserResource')
const theDB = require('the-db').default
const {ok, equal} = require('assert')

describe('the-profile-resource', () => {
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    const db = theDB({
      dialect: 'memory'
    })
    const User = db.load(TheUserResource, 'User')
    const Profile = db.load(TheProfileResource, 'Profile')

    const user01 = await User.create({name: 'user01'})
    await Profile.create({email: 'a@example.com', user: user01})

    const user02 = await User.create({name: 'user02'})
    const profile02 = await Profile.create({user: user02})

    try {
      await profile02.update({email: 'a@example.com'}, {errorNamespace: 'profile'})
    } catch (e) {
      ok(e.detail.conflict['profile.email'])
    }
  })
})

/* global describe, before, after, it */
