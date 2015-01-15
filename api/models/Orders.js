/**
* Orders.js
*
* @description :: The orders data models
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  connection: 'MongoDB',
  attributes: {
    orderNumber: {
      type: 'string',
      required: true
    },
    email: {
      type: 'email'
    },
    // so that we can save the 0 in front, or +6 or whatever it is
    phone: {
      type: 'string'
    },
    // to normalize or denormalize?
    // since the API only allow the process of updating the status of the order,
    // no need to worry about embedding the product into the order itself
    products: {
      type: 'array',
      required: true
    },
    closestRestaurant: {
      type: 'string'
    },
    status: {
      type: 'string',
      enum: ['confirm', 'paid', 'brewing', 'ready to pickup']
    },
    total: {
      type: 'float',
      required: true
    }
  }
};

