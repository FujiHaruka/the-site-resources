'use strict'

const {TheAliasResource} = require('the-site-resources')
const theDB = require('the-db')

async function tryExample () {
  const db = theDB({/* ... */})

  // Load resource classes
  {
    class Alias extends TheAliasResource {

    }

    db.load(Alias, 'Alias')
  }

  // Use resource instances
  {
    const {Alias} = db.resources
    const alias = await Alias.ofUrl(`http://example.com/foo/bar`)
    /* ... */
  }

}

tryExample().catch((err) => console.error(err))
