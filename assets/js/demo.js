$('.demo-restaurant').on('click', function (e) {
  e.preventDefault();
  var location = get_location(function (err, location) {
    if (err) alert(err);
    if (typeof location == 'object') {
      $.ajax({
        url: 'restaurant',
        type: 'GET',
        contentType: "application/json",
        data: 'lat=' + location.lat + '&lng=' + location.lng + '&radii=7'
      }).done(function (res){
        if (res.statusCode === 200) {
          var place = res.data[0];
          $('.restaurant-result').html('<p>The closest restaurant to your location is at <b>' + place.name + '</b></p>' +
            '<a href="https://maps.google.com/maps?q=' + place.geometry.location.lat + ',' + place.geometry.location.lng + 
            '" target="_blank">View this at Google Maps</a>').removeClass('hidden');
        } else {
          $('.restaurant-result').text('Something has failed you.');
        }
      });
    };
  });  
});

$('.demo-menus').on('click', function (e) {
  e.preventDefault();
  var category = 'Espresso+Beverages',
      sub = 'cold';

  $.ajax({
    url: 'menus',
    type: 'GET',
    contentType: "application/json",
    data: 'category=' + category + '&subcategory=' + sub
  }).done(function (res){
    if (res.statusCode === 200) {
      var menus = res.data;
      $('.menus-result').html('<p>Below are the list menus according to your selection</p>' +
        '<ul class="menu-list"></ul>').removeClass('hidden');
      $.each(menus, function (i, menu) {
        $('.menu-list').append('<li>' + menu.name + ': RM' + menu.price + '</li>');
      });
    } else {
      $('.menus-result').text('Something has failed you.');
    }
  });
});

$('.demo-order').on('click', function (e) {
  e.preventDefault();

  var user = $('.user').val(),
      ids = ["54bbad7ef1fb600300d0b779", "54bbad7ef1fb600300d0b797", "54bbad7ef1fb600300d0b78d"];
      data = {};

  if (!user) {
    alert('We need either your email address or phone number before we can proceed');
    $('.user').focus();
  } else {
    var location = get_location(function (err, location) {
      if (err) alert(err);
      if (typeof location == 'object') {
        data = {
          lat: location.lat,
          lng: location.lng,
          radii: 7,
          productId: ids,
          user: user
        }

        data = JSON.stringify(data);
        $.ajax({
          url: 'order',
          type: 'POST',
          contentType: "application/json",
          data: data
        }).done(function (res){
          if (res.statusCode === 200) {
            var order = res.data;
            $('.order-result').html('<p>Your order are now confirmed. Below are the information of your order:</p>' +
              '<p>Order Number: ' + order.orderNumber +
              '</p><p>Total Price: ' + order.total +
              '</p><p>Customer ID: ' + order.user +
              '</p><p>Status: ' + order.status +
              '</p><div class="products"><p>Products:</p></div>').removeClass('hidden');

            $.each(order.products, function (i, product) {
              $('.order-result .products').append('<p>' + product.name + '</p>');
            });
          } else {
            $('.order-result').text('Something has failed you.');
          }
        });
      }
    });
  }
});

$('.demo-status').on('click', function (e) {
  e.preventDefault();

  var od = $('.order-number').val();

  if (!od) {
    alert('We need the order number please.');
    $('.order-number').focus();
  } else {
    $.ajax({
      url: 'order/' + od + '/paid',
      type: 'PATCH',
      contentType: "application/json"
    }).done(function (res){
      if (res.statusCode === 200) {
        var order = res.data[0];
        console.log(res);
        $('.status-result').html('<p>The order status updated. Below are the information of the order:</p>' +
          '<p>Order Number: ' + order.orderNumber +
          '</p><p>Total Price: ' + order.total +
          '</p><p>Customer ID: ' + order.user +
          '</p><p>Status: ' + order.status +
          '</p><div class="products"><p>Products:</p></div>').removeClass('hidden');

        $.each(order.products, function (i, product) {
          $('.status-result .products').append('<p>' + product.name + '</p>');
        });
      } else {
        $('.status-result').text('Something has failed you.');
      }
    });
  }
});

$('.demo-history').on('click', function (e) {
  e.preventDefault();

  var user = $('.user-history').val();

  if (!user) {
    alert('We need the user email or phone please.');
    $('.user-history').focus();
  } else {
    $.ajax({
      url: 'order/' + user,
      type: 'GET',
      contentType: "application/json"
    }).done(function (res){
      if (res.statusCode === 200) {
        var order = res.data;

        if (order.length) {
          $('.history-result')
            .html('<p>Below are the list of orders made by this customer:</p>')
            .removeClass('hidden');

          $.each(order, function (i,o) {
            $('.history-result').append('<div class="order bg-lighter-gray border-bottom py2 px2"><p>Order Number: ' + o.orderNumber +
            '</p><p>Total Price: ' + o.total +
            '</p><p>Customer ID: ' + o.user +
            '</p><p>Status: ' + o.status +
            '</p><div class="products"><p>Products:</p></div></div>');

            $.each(o.products, function (i, product) {
              $('.history-result .products').append('<p>' + product.name + '</p>');
            });
          });
        } else {
          ('.history-result').text('The given user does not have any order history');
        }
      } else {
        $('.history-result').text('Something has failed you.');
      }
    });
  }
})

function get_location(callback) {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (loc) {
      var lat = loc.coords.latitude,
          lng = loc.coords.longitude,
          geo = {
            lat: lat,
            lng: lng
          };

      callback(null, geo);
    }, function(err) {
      callback(err.message);
    });
  } else {
    callback("Your browser doesn't support Location API.");
  }
}