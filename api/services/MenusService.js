/**
 * MenusService
 *
 * @description :: Functions that can be use across the app
 * @help        :: See http://sailsjs.org/#/documentation/concepts/Services
 */

 module.exports = {
  getAMenu: function (id, callback) {
    Menus.find({ id: id }).exec(function (err, menu) {
      if (err) callback(err);
      else callback(null, menu);
    });
  }
 };