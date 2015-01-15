/**
 * OrderService
 *
 * @description :: Functions that can be use across the app
 * @help        :: See http://sailsjs.org/#/documentation/concepts/Services
 */

 module.exports = {
  orderNumber: function (callback) {
    OrderNumber.find().exec(function (err, od) {
      if (!err && od.length > 0) {
        var orderNumber = od[0].current + 1;
        OrderNumber.update({ id: od[0].id }, { current: orderNumber }).exec(function (err, update) {
          if (!err) {
            callback(null, 'SB' + orderNumber);
          } else {
            callback(err);
          }
        });
      } else {
        var defaultOD = 1000;
        OrderNumber.create({ current: defaultOD}).exec(function (err, update) {
          if (!err) {
            callback(null, 'SB' + defaultOD);
          } else {
            callback(err);
          }
        });
      }
    });
  }
 };