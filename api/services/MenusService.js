/**
 * MenusService
 *
 * @description :: Functions that can be use across the app
 * @help        :: See http://sailsjs.org/#/documentation/concepts/Services
 */

 module.exports = {
  getMenuById: function (ids, callback) {
    if (typeof ids == 'object') {
      var products = [];

      Menus.find()
            .where({ id : ids })
            .exec(function (err, menus) {
              if (err) callback(err);
              else callback (null, menus);
            })
    }
  }
 };