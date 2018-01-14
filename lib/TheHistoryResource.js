/**
 * @class TheHistoryResource
 * @augments Resource
 */
'use strict'

const {
  TheResource,
  DataTypes: {STRING, DATE, OBJECT},
} = require('the-resource-base')

/** @lends TheHistoryResource */
class TheHistoryResource extends TheResource.WriteOnce {

  static get types () {
    throw new Error('Not implemented')
  }

  static get policy () {
    return {
      type: {
        description: 'History type',
        type: STRING,
        oneOf: Object.values(this.types),
        required: true,
      },
      data: {
        description: 'History data',
        type: OBJECT,
      },
      key: {
        description: 'History key',
        type: STRING,
        required: true,
        uniqueFor: ['type'],
      },
      createdAt: {
        description: 'Created date',
        type: DATE,
        default: () => new Date(),
      },
    }
  }

  static entityClass (ResourceEntity) {
    /** @class */
    class TheHistoryResourceEntity extends ResourceEntity {
    }

    return TheHistoryResourceEntity
  }
}

Object.assign(TheHistoryResource, {})

module.exports = TheHistoryResource
