/**
 * Test for TheHistoryResource.
 * Runs with mocha.
 */
'use strict'

const TheHistoryResource = require('../lib/TheHistoryResource')
const theDB = require('the-db').default
const {ok, equal} = require('assert')

describe('the-history-resource', () => {
  before(() => {
  })

  after(() => {
  })

  it('Do test', async () => {
    const db = theDB({
      dialect: 'memory'
    })

    const History = db.load(class extends TheHistoryResource {
      static get types () {
        return {
          A: 'A'
        }
      }
    }, 'History')

    const history = await History.create({
      type: 'A',
      key: 'a'
    })
    ok(history)
  })
})

/* global describe, before, after, it */
