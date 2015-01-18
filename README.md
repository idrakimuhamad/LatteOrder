# LatteOrder

A [Sails](http://sailsjs.org) application to produce API for coffee bookings and cafe's locater.

# [.Intro](#intro)

The API expose a number of ability, as such listed below:

* Query closest restaurant from the given coordinate
* Query for menus
* Make order using email or phone number
* Update order's status
* Look up for customer's order history

The request doesn't require any authentication. The purpose is just for a usage example of Sails.js. It also doesn't implement any CSRF token etc.

# [.Get Started](#getstarted)

To get started, before running the app, make sure to run `npm install` to install the dependencies. After that, run `sails lift` to run the app.

You can then access the app at http://localhost:1337

The app by default doesn't have any data. So to add the default data, navigate to http://localhost:1337/firsttime which will automatically insert the default data, if it doesn't exists.

Once you've done that, you can start testing the API. Note that, most of the request would require the `Content-Type: application/json` header.

[See the demo online](http://latte-order.herokuapp.com/)
