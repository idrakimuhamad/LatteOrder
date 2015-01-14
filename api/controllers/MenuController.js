/**
 * MenuController
 *
 * @description :: Server-side logic for managing menus
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs');


module.exports = {
  getMenu: function (req, res) {
    var subcat = req.param('subcat'),
        category = req.param('category'),
        query = '';

    if (category) {
      query += '{"category":{"contains": "' + category + '"}}'
    }

    if (subcat) {
      if (category) {
        query += ',{"subcategory":{"contains": "' + subcat + '"}}'
      } else {
        query += '{"subcategory":{"contains": "' + subcat + '"}}'
      }
    }

    if (query.length > 0)  {
      query = JSON.parse(query);
      Menu.find().where(query).exec(function (err, menu) {
        res.json({
          menus: menu
        });
      });
    } else {
      Menu.find().exec(function (err, menu) {
        res.json({
          menus: menu
        });
      });
    }
  },
	addDataFirstTime: function (req, res) {
    Menu.find().exec(function (err, menu) {
      if(!menu.length) {
        // declare the directory o f the data files
        var dir = "./assets/js";

        // read the file
        var datastream = fs.createReadStream(dir + '/menu.json', {
          encoding: 'utf8',
          autoClose: true
        });

        // parse the data and write into DB
        datastream.on('readable', function () {
          var chunks = datastream.read();
          chunks = JSON.parse(chunks);

          // base on its name, identify if the item subcategory
          for (var i = 0; i < chunks.length; i ++) {
            if (chunks[i].name.indexOf('Iced') > -1) {
              chunks[i].subcategory = 'cold';
            } else {
              chunks[i].subcategory = 'hot';
            }
            Menu.create(chunks[i]).exec(function insertMenu(err, menu) {
              if (err) {
                console.log("There are some problem in inserting the menu. " + err);
                res.end("Some error occurred. See logs.");
              } else {
                console.log('Created a menu for ' + menu.name + ' with a subcategory of ' + menu.subcategory);
              }
            })
          };
        });
      }
    });

    Locations.find().exec(function (err, locations) {
      if(!locations.length) {
        // declare the directory o f the data files
        var dir = "./assets/js";

        // read the file
        var datastream = fs.createReadStream(dir + '/locations.json', {
          encoding: 'utf8',
          autoClose: true
        });

        // parse the data and write into DB
        datastream.on('readable', function () {
          var chunks = datastream.read();
          chunks = JSON.parse(chunks);

          for (var i = 0; i < chunks.length; i ++) {
            Locations.create(chunks[i]).exec(function insertCafe(err, cafe) {
              if (err) {
                console.log("There are some problem in inserting the cafe. " + err);
                res.end("Some error occurred. See logs.");
              } else {
                console.log('Inserted a cafe for ' + cafe.name);
              }
            })
          };
        });
      }
    });

  },
  clearAllMenu: function (req, res) {
    Menu.destroy({}).exec(function clearAllMenu(err) {
      console.log('All of the menu has been deleted');
      res.end('All of the menu has been deleted');
    });
  }
};

