/**
* Menus.js
*
* @description :: Starbucks menu's models
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  connection: 'MongoDB',
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    price: {
      type: 'float',
      required: true
    },
    category: {
      type: 'string',
      required: true
    }
  }

};

