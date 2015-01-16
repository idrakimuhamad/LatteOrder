/**
 * OrderService
 *
 * @description :: Functions that can be use across the app
 * @help        :: See http://sailsjs.org/#/documentation/concepts/Services
 */

 module.exports = {
  // check for current order number and rewrite it after increment
  orderNumber: function (callback) {
    OrderNumber.find().exec(function (err, od) {
      if (!err && od.length > 0) {
        var orderNumber = od[0].current + 1;
        OrderNumber.update({ id: od[0].id }, { current: orderNumber }).exec(function (err, update) {
          if (err) callback(err);
          else callback(null, 'SB' + orderNumber);
        });
      } else {
        var defaultOD = 1000;
        OrderNumber.create({ current: defaultOD}).exec(function (err, update) {
          if (err) callback(err);
          else callback(null, 'SB' + defaultOD);
        });
      }
    });
  },
  // lookup order by query
  getOrder: function (query, callback) {
    Orders.find(query)
            .exec(function (err, order) {
              if (err) callback(err);
              else callback(null, order);
            });
  },
  // update order by any properties and value
  updateOrder: function (order, toUpdate, callback) {
    // toUpdate is an object that should be setup before calling this function
    // it can be any of the property that an Order has
    // eg: to change the status, the object should be pass as:
    // { status: 'paid' }
    Orders.update({ orderNumber: order}, toUpdate).exec(function (err, update) {
      if (err) callback(err);
      else callback(null, update);
    })
  }
 };