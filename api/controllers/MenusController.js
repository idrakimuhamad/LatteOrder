/**
 * MenusController
 *
 * @description :: Server-side logic for managing menus
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var fs = require('fs');


module.exports = {
  getMenus: function (req, res) {
    // get the params in the request
    var query = req.params.all();

    // search with exact params
    Menus.find(query)
          .exec(function (err, menu) {
            if (err) return res.serverError(err);
            
            res.json({
              statusCode: 200,
              data: menu
            })
          });
  },
  // run on first time, to add default data
  addDataFirstTime: function (req, res) {

    // check if there are any data for menu, if not insert initial data
    // for both Menus and Locations
    // We assume here that, if there are no data in Menus, there will be
    // no data in Locations too.
    Menus.find({ limit: 1 })
          .exec(function (err, menu) {
            if (!menu.length) {
              // declare the directory o f the data files
              var dir = "./assets/js";

              // read the menu file
              var menuStream = fs.createReadStream(dir + '/menu.json', {
                encoding: 'utf8',
                autoClose: true
              });

              // read the location file
              var locationStream = fs.createReadStream(dir + '/locations.json', {
                encoding: 'utf8',
                autoClose: true
              });

              // parse the data and write into DB
              menuStream.on('readable', function () {
                var chunks = menuStream.read();
                chunks = JSON.parse(chunks);

                // base on its name, identify the item subcategory
                for (var i = 0; i < chunks.length; i ++) {
                  if (chunks[i].name.indexOf('Iced') > -1) {
                    chunks[i].subcategory = 'cold';
                  } else {
                    chunks[i].subcategory = 'hot';
                  }
                  // insert the menu in collection
                  Menus.create(chunks[i])
                        .exec(function insertMenu(err, menu) {
                          if (err) {
                            console.log("There are some problem in inserting the menu. " + err);
                            res.end("Some error occurred. See logs.");
                          } else {
                            console.log('Created a menu for ' + menu.name + ' with a subcategory of ' + menu.subcategory);
                          }
                        });
                };
              });

              // parse the data and write into DB
              locationStream.on('readable', function () {
                var chunks = locationStream.read();
                chunks = JSON.parse(chunks);

                for (var i = 0; i < chunks.length; i ++) {
                  Locations.create(chunks[i])
                            .exec(function insertCafe(err, cafe) {
                              if (err) {
                                console.log("There are some problem in inserting the cafe. " + err);
                                res.end("Some error occurred. See logs.");
                              } else {
                                console.log('Inserted a cafe for ' + cafe.name);
                              }
                            });
                };
              });
              res.end('Successfully inserted the initial data');
            } else {
              res.end('Data has already been inserted');
            }
          });
  },
  clearAllMenus: function (req, res) {
    Menus.destroy({}).exec(function clearAllMenus(err) {
      console.log('All of the menu has been deleted');
      res.end('All of the menu has been deleted');
    });
  }
};

