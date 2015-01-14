/**
 * LocationsController
 *
 * @description :: Server-side logic for managing locations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  clearAllLocations: function (req, res) {
    Locations.destroy({}).exec(function clearAllLocations(err) {
      console.log('All of the location has been deleted');
      res.end('All of the location has been deleted');
    });
  }
};

