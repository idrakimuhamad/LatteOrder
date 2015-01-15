/**
 * OrdersController
 *
 * @description :: Order's controller and logic
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	insertOrder: function (req, res) {
    var productId = req.param('productId'),
        geo = {
          lat: parseFloat(req.param('lat')),
          lng: parseFloat(req.param('lng')),
          radii : req.param('radii') ? parseFloat(req.param('radii')) : 5
        },
        orders = {};

    if (geo) {
      LocationsService.getClosestRestaurant(geo, function (err, results) {
        if (err) return res.serverError(err + ': Some problem while retrieving the restaurant');

        if (!results.length) {
          return res.json({
            statusCode: 200,
            data: {
              errorMessage: 'There are no restaurant that are close to your location.'
            }
          })
        } else {
          var address = results[0].name + ', ' + results[0].formatted_address;

          MenusService.getAMenu(productId, function (err, results) {
            if (err) return res.serverError(err + ': Some problem while retrieving the Menu');

            // get the order number
            OrdersService.orderNumber(function (err, od) {
              if (err) return res.serverError(err + ': Some problem while generating the order number');

              orders = {
                orderNumber: od,
                products: [{
                  name: results[0].name,
                  price: results[0].price.toFixed(2),
                  category: results[0].category
                }],
                closestRestaurant: address,
                status: 'confirm',
                total: results[0].price.toFixed(2)
              };

              if (req.param('email')) {
                orders.email = req.param('email');
              } else if (req.param('phone')) {
                orders.phone = req.param('phone');
              }

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
  }
};

