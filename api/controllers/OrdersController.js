/**
 * OrdersController
 *
 * @description :: Order's controller and logic
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	insertOrder: function (req, res) {
    if (req.is('application/json')) {
      var productId = req.param('productId'),
          geo = {
            lat: parseFloat(req.param('lat')),
            lng: parseFloat(req.param('lng')),
            radii : req.param('radii') ? parseFloat(req.param('radii')) : 5
          },
          orders = {},
          totalPrice = 0;

      if (geo) {
        LocationsService.getClosestRestaurant(geo, function (err, results) {
          if (err) return res.serverError(err + ': Some problem while retrieving the restaurant');

          if (!results.length) {
            return res.json({
              status: 'NO_NEAR_RESTAURANT',
              message: 'There are no restaurant that are close to the given location.'
            });
          } else {
            var address = results[0].name + ', ' + results[0].formatted_address;

            MenusService.getMenuById(productId, function (err, results) {
              if (err) return res.serverError(err + ': Some problem while retrieving the Menu');

              var menus = results;
              // get the order number
              OrdersService.orderNumber(function (err, od) {
                if (err) return res.serverError(err + ': Some problem while generating the order number');

                orders = {
                  orderNumber: od,
                  closestRestaurant: address,
                  products: menus,
                  status: 'confirm',
                };

                menus.forEach(function (menu) {
                  totalPrice += menu.price;
                });

                orders.total = totalPrice.toFixed(2);

                if (req.param('email')) {
                  orders.email = req.param('email');
                } else if (req.param('phone')) {
                  orders.phone = req.param('phone');
                }

                Orders.create(orders).exec(function insertOrder(err, order) {
                  if (err) return res.serverError(err + ': Some problem while creating the order');
                  res.ok(order);
                });
              });
            });
          }
        });
      }
    } else {
      res.badRequest('Missing Content-Type: application/json');
    }
  },
  lookupOrder: function (req, res) {
    if (req.is('application/json')) {
      // get the order number
      var orderNumber = req.param('orderNumber');

      // look up for the order
      OrdersService.getOrderByOrderNumber(orderNumber, function (err, order) {
        if (err) return res.serverError(err);
        res.ok(order)
      })
    }
  },
  updateOrderStatus: function (req, res) {
    if (req.is('application/json')) {
      var orderNumber = req.param('orderNumber'), // get the order number
          statusObj = { status: req.param('status') }; // get the status

      // Update the status
      OrdersService.updateOrder(orderNumber, statusObj, function (err, order) {
        if (err) return res.serverError(err);
        res.ok(order)
      })
    }
  }
};

