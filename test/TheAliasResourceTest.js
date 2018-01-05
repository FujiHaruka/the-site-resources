/**
 * Test for TheAliasResource.
 * Runs with mocha.
 */
'use strict'

const TheAliasResource = require('../lib/TheAliasResource')
const theDB = require('the-db')
const {ok, equal} = require('assert')

describe('the-alias-resource', () => {
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    const db = theDB({
      dialect: 'memory'
    })
    db.load(TheAliasResource, 'Alias')

    const {Alias} = db.resources
    const alias = await Alias.ofUrl(`http://example.com/foo/bar`)
    ok(alias.pathname)

    equal(
      alias.urlFor({protocol: 'https', host: 'hoge'}).indexOf('https://hoge/a'),
      0
    )
  })
})

/* global describe, before, after, it */