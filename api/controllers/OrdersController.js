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
                  user: req.param('user')
                };

                menus.forEach(function (menu) {
                  totalPrice += menu.price;
                });

                orders.total = totalPrice.toFixed(2);

                Orders.create(orders).exec(function insertOrder(err, order) {
                  if (err) return res.serverError(err + ': Some problem while creating the order');
                  res.json({
                    statusCode: 200,
                    data: order
                  })
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
    // get the order number
    var query = req.param('query');

    if (!query) res.badRequest('Missing either order number or customer\'s email or phone number');

    if (query.indexOf('SB') > -1) {
      query = { orderNumber: query };
    } else {
      query = { user: query };
    }

    // look up for the order
    OrdersService.getOrder(query, function (err, order) {
      if (err) return res.serverError(err);
      res.json({
        statusCode: 200,
        data: order
      });
    });
  },
  updateOrderStatus: function (req, res) {
    var orderNumber = req.param('orderNumber'), // get the order number
          statusObj = { status: req.param('status') }; // get the status

    // Update the status
    OrdersService.updateOrder(orderNumber, statusObj, function (err, order) {
      if (err) return res.serverError(err);
      res.json({
        statusCode: 200,
        data: order
      });
    });
  }
};

