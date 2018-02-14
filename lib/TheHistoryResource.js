/**
 * @class TheHistoryResource
 * @augments Resource
 */
'use strict'

const {
  DataTypes: {DATE, OBJECT, STRING},
  TheResource,
} = require('the-resource-base')

/** @lends TheHistoryResource */
class TheHistoryResource extends TheResource.WriteOnce {

  static get policy () {
    return {
      createdAt: {
        default: () => new Date(),
        description: 'Created date',
        type: DATE,
      },
      data: {
        description: 'History data',
        type: OBJECT,
      },
      key: {
        description: 'History key',
        required: true,
        type: STRING,
        uniqueFor: ['type'],
      },
      type: {
        description: 'History type',
        oneOf: Object.values(this.types),
        required: true,
        type: STRING,
      },
    }
  }

  static get types () {
    throw new Error('Not implemented')
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
