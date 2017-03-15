$(document).ready(function() {
  var $spinner = $('#spinner');
  var $searchResultsGrid = $('#search-results-grid');

  var grayScaleMap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  var basic = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0939ma8002h2sn787k9ye4n/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
    attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  var another = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0ah6u9o000f2rno9feszoec/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
    attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  var emerald = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0ahszig000c2rpiq7bnehiz/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
    attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  var light = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0aiq63z000i2smut4o8a2kl/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
    attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  var runner = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0aiwt2c000p2ss4e9zail8o/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
    attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  var streets = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0aj03o1000i2rp8oakz1f99/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
    attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  var swissSki = L.tileLayer('https://api.mapbox.com/styles/v1/zeckdude/cj0aj20fd000r2ss479i5y5ec/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemVja2R1ZGUiLCJhIjoiY2owOTM3cWd0MDdhZzJ3cGQ0YzMzOWptNyJ9.SHjLBYIXAtHbPRY9iM0aVA', {
    attribution: '© <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
    maxZoom: 18
  });

  var map = new L.Map('map', {
    layers: [basic],
    center: new L.LatLng(29.72, -95.35),
    zoom: 10,
    zoomControl: false,
    scrollWheelZoom: false
  });

  // Add our zoom control manually where we want to
  var zoomControl = L.control.zoom({
      position: 'topright'
  });
  map.addControl(zoomControl);

  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  var drawControl = new L.Control.Draw({
    position: 'topright',
    edit: {
      featureGroup: drawnItems,
      edit: false,
      remove: false
    },
    draw: {
      circle: false,
      marker: false,
      polyline: false
    }
  });

  map.addControl(drawControl);

  var markers = [];
  var polygon = null;
  map.on('draw:created', function (e) {
    // remove markers and polygon from the last run
    $.each (markers, function (i) { map.removeLayer(markers[i]) });
    if (polygon != null) map.removeLayer (polygon);

    var latLngs = $.map(e.layer.getLatLngs()[0], function(o) {
      return { name: "points", value: o.lat + "," + o.lng };
    });

    $.ajax({
      url: 'https://api.simplyrets.com/properties',
      data: latLngs,
      beforeSend: function(xhr) {
        $spinner.show({
          complete: function() {
            $(this).css('opacity', '1');
          }
        });
        xhr.setRequestHeader("Authorization", "Basic " + btoa("simplyrets:simplyrets"));
      },
      success: function(response) {
        var spinnerTimeOut = setTimeout(function(){
          $spinner
            .css('opacity', '0')
            .on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
             function(e){
                $(this).hide();
                $(this).off(e);
             });

             clearTimeout(spinnerTimeOut);
        }, 500);

        $searchResultsGrid.html('');

        $.each (response, function (i, listing) {
          //Pre-load images for the current listing
          $.each(listing.photos, function(i, photo){
            var img = new Image();
            img.src = photo;
            //console.log(img);
            console.log('finished preloading images');
          });

          // Create a new marker based on the coordinates of the current listing
          var markerLocation = new L.LatLng(listing.geo.lat, listing.geo.lng);
          var marker = new L.Marker(markerLocation);
console.log('binding popup');
          // Define the popup contents to show when the marker is clicked
          marker.bindPopup(
            _.templateFromUrl('templates/listing-popup-template.html',
            $.extend({}, listing, {
              listPrice: $.number(listing.listPrice, 0)
            }))
          );

          // When the popup opens after a user clicks it, perform a series of operations
          marker.on('popupopen', function (e) {
            var popup = e.popup;
            var $popup = $(popup.getElement());
            var $imagesContent = $popup.find('.images-content');

            // Center the map on the marker and popup
            var px = map.project(popup.getLatLng()); // find the pixel location on the map where the popup anchor is
            px.y -= $popup.height()/2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
            map.panTo(map.unproject(px),{animate: true}); // pan to new center

            // Initialize the flexslider to carousel through the images
            $imagesContent.flexslider({
              animation: "slide",
              customDirectionNav: $imagesContent.next(".custom-navigation").find('a'),
              controlNav: false,
              easing: "linear"
            });

            $('#listing-detail').on('beforeshow', function() {
              $(this).find('.listing-detail-content').html(
                _.templateFromUrl('templates/listing-detail-content.html',
                $.extend({}, listing, {
                  listPrice: $.number(listing.listPrice, 0),
                  stateAbbreviation: convertState(listing.address.state, 'abbreviation')
                }))
              );
            });

            $('#listing-detail').on('show', function() {
              var $listingDetailImagesContent = $(this).find('.images-content');
              $listingDetailImagesContent.flexslider({
                animation: "slide",
                customDirectionNav: $listingDetailImagesContent.next(".custom-navigation").find('a'),
                controlNav: false,
                easing: "linear"
              });
            });
          });

          map.addLayer(marker);
          markers.push(marker);

          // Add the results to the search resuls grid
          $searchResultsGrid.append(
            _.templateFromUrl('templates/search-result-single.html',
            $.extend({}, listing, {
              listPrice: $.number(listing.listPrice, 0),
              stateAbbreviation: convertState(listing.address.state, 'abbreviation')
            }))
          );

        });
      }
    });

    polygon = e.layer;
    map.addLayer(e.layer);
  });
});
