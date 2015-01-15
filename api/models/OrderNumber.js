/**
* OrderNumber.js
*
* @description :: The order number
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  connection: 'MongoDB',
  attributes: {
    current: {
      type: 'integer'
    }
  }
};

