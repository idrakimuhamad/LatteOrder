/**
 * UtilService
 *
 * @description :: Functions that can be use across the app
 * @help        :: See http://sailsjs.org/#/documentation/concepts/Services
 */

module.exports = {
  randomCharacter: function () {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
}
