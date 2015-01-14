/**
 * LocationsController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  getClosestRestaurant: function (req, res) {
    var lat = parseFloat(req.param('lat'));
    var lng = parseFloat(req.param('lng'));
    // if radius was passed, use it. else defaulted to 5
    var radii = req.param('radii') ? parseFloat(req.param('radii')) : 5;

    // using the lat and lng, uses Mongo's spatial
    Locations.native(function(err,collection) {
      if (err) return res.serverError(err);

      var loc = collection.find({
        'geometry.location': {
          $geoWithin: {
            $center: [ [ lat, lng ] , radii ]
          }
        }
      }).toArray(function (err, results) {
        if (err) return res.serverError(err);
        return res.json({
          restaurant: results
        });
      });

    });
  },
  clearAllLocations: function (req, res) {
    Locations.destroy({}).exec(function clearAllLocations(err) {
      console.log('All of the location has been deleted');
      res.end('All of the location has been deleted');
    });
  }
};

