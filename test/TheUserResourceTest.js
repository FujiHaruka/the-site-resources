/**
 * Test for TheUserResource.
 * Runs with mocha.
 */
'use strict'

const TheUserResource = require('../lib/TheUserResource')
const theDB = require('the-db').default
const {ok, equal} = require('assert')

describe('the-user-resource', () => {
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    const db = theDB({
      dialect: 'memory'
    })
    const User = db.load(TheUserResource, 'User')

    const user01 = await User.create({name: 'hoge'})
    equal(user01.displayName, 'hoge')
  })
})

/* global describe, before, after, it */
