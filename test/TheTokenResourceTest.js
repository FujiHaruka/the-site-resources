/**
 * Test for TheTokenResource.
 * Runs with mocha.
 */
'use strict'

const TheTokenResource = require('../lib/TheTokenResource')
const {ok, equal, doesNotThrow} = require('assert')
const theDB = require('the-db').default

describe('the-token-resource', () => {
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    const db = theDB()
    const Token = db.load(TheTokenResource, 'Token')

    const t01 = await Token.create()
    ok(t01)
    const {token} = t01
    ok(token)

    await Token.verify(token)

    await Token.consume(token)

    const caught = await Token.verify(token).catch((e) => e)
    ok(caught instanceof Error)
  })
})

/* global describe, before, after, it */
