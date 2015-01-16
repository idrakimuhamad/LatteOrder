/**
 * LocationsController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  // return the closest restaurant from the given coordinate
  getRestaurants: function (req, res) {
    var options = {
      lat: parseFloat(req.param('lat')),
      lng: parseFloat(req.param('lng')),
      radii : req.param('radii') ? parseFloat(req.param('radii')) : 5
    };

    LocationsService.getClosestRestaurant(options, function (err, results) {
      if (err) return res.serverError(err);
      res.ok(results);
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

