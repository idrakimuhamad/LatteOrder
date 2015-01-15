/**
 * LocationsService
 *
 * @description :: Functions that can be use across the app
 * @help        :: See http://sailsjs.org/#/documentation/concepts/Services
 */

 module.exports = {
  getClosestRestaurant: function (args, callback) {
    var lat = parseFloat(args.lat);
    var lng = parseFloat(args.lng);

    // if radius was passed, use it. else defaulted to 5
    var radii = args.radii ? parseFloat(args.radii) : 5;

    // IMPORTANT!
    // Make sure to index the geometry field through the mongo console.
    // Not necessary but should improve performance dramatically
    Locations.native(function(err,collection) {
      if (err) return err;

      // using the lat and lng, uses Mongo's spatial $near features
      // the order should be longitude, latitude first, but since the data is in the reverse order,
      // we just apply it this way to avoid mongoDB confusion

      // We uses $near to compare with $geoWithin because $near return a sorted results,
      // though have some impact on performance, since we only needed the one and only closest
      // to the given coordinate, *might* not be a problem
      collection.find({
        'geometry.location': {
          $near: [ lat, lng ],
          $maxDistance: radii
        }
      }).limit(1).toArray(function (err, results) {
        if (!err) {
          callback(null, results);
        } else {
          callback(err);
        }
      });
    });
  }
 }
