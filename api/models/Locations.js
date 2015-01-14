/**
* Locations.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  types: {
    is_coord: function (geo) {
      return geo.location.lat && geo.location.lng;
    }
  },
  connection: 'MongoDB',
  attributes: {
    formatted_address: {
      type: 'string',
      required: true
    },
    geometry: {
      type: 'json',
      is_coord: true
    },
    icon: {
      type: 'string'
    },
    id: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    place_id: {
      type: 'string',
      required: true
    },
    reference: {
      type: 'string',
      required: true
    },
    types: {
      type: 'array'
    }
  }
};

