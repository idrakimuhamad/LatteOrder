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

    // IMPORTANT!
    // Make sure to index the geometry field through the mongo console.
    // Not necessary but should improve performance dramatically

    // using the lat and lng, uses Mongo's Geospatial features
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
    // quick way to remove all of the data from the collection, ready to be insert again
    // through /firsttime
    Locations.destroy({}).exec(function clearAllLocations(err) {
      console.log('All of the location has been deleted');
      res.end('All of the location has been deleted');
    });
  }
};

