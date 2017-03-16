$(document).ready(function() {
  var $spinner = $('#spinner');
  var $searchResultsGrid = $('#search-results-grid');
  var markers = [];
  var polygon = null;

  var map = new L.Map('map', {
    layers: [basic],
    center: new L.LatLng(29.72, -95.35),
    zoom: 10,
    maxZoom: 18,
    zoomControl: false,
    scrollWheelZoom: false
  });

  // Add the zoom control manually at a specified position on the map
  var zoomControl = L.control.zoom({
      position: 'topright'
  });
  map.addControl(zoomControl);

  // Add draw toolbar to the map
  var drawnItems = new L.FeatureGroup();
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
  map.addLayer(drawnItems);
  map.addControl(drawControl);

  map.on('draw:created', function (e) {
    // Remove markers and polygon from the last run
    $.each (markers, function (i) { map.removeLayer(markers[i]) });
    if (polygon != null) map.removeLayer (polygon);

    var latLngs = $.map(e.layer.getLatLngs()[0], function(o) {
      return { name: "points", value: o.lat + "," + o.lng };
    });

    //getSearchResults(latLngs, displaySearchResults);
    var searchResults = getSearchResults(latLngs);
    displaySearchResults(searchResults, $searchResultsGrid, map, markers);

//     $.ajax({
//       url: 'https://api.simplyrets.com/properties',
//       data: latLngs,
//       beforeSend: function(xhr) {
//         $spinner.show({
//           complete: function() {
//             $(this).css('opacity', '1');
//           }
//         });
//         xhr.setRequestHeader("Authorization", "Basic " + btoa("simplyrets:simplyrets"));
//       },
//       success: function(response) {
//         var spinnerTimeOut = setTimeout(function(){
//           $spinner
//             .css('opacity', '0')
//             .on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
//              function(e){
//                 $(this).hide();
//                 $(this).off(e);
//              });
//
//              clearTimeout(spinnerTimeOut);
//         }, 500);
//
//         $searchResultsGrid.html('');
//
//         $.each (response, function (i, listing) {
//           //Pre-load images for the current listing
//           $.each(listing.photos, function(i, photo){
//             var img = new Image();
//             img.src = photo;
//             //console.log(img);
//             console.log('finished preloading images');
//           });
//
//           // Create a new marker based on the coordinates of the current listing
//           var markerLocation = new L.LatLng(listing.geo.lat, listing.geo.lng);
//           var marker = new L.Marker(markerLocation);
// console.log('binding popup');
//           // Define the popup contents to show when the marker is clicked
//           marker.bindPopup(
//             _.templateFromUrl('templates/listing-popup-template.html',
//             $.extend({}, listing, {
//               listPrice: $.number(listing.listPrice, 0)
//             }))
//           );
//
//           // When the popup opens after a user clicks it, perform a series of operations
//           marker.on('popupopen', function (e) {
//             var popup = e.popup;
//             var $popup = $(popup.getElement());
//             var $imagesContent = $popup.find('.images-content');
//
//             // Center the map on the marker and popup
//             var px = map.project(popup.getLatLng()); // find the pixel location on the map where the popup anchor is
//             px.y -= $popup.height()/2 // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
//             map.panTo(map.unproject(px),{animate: true}); // pan to new center
//
//             // Initialize the flexslider to carousel through the images
//             $imagesContent.flexslider({
//               animation: "slide",
//               customDirectionNav: $imagesContent.next(".custom-navigation").find('a'),
//               controlNav: false,
//               easing: "linear"
//             });
//
//             $('#listing-detail').on('beforeshow', function() {
//               $(this).find('.listing-detail-content').html(
//                 _.templateFromUrl('templates/listing-detail-content.html',
//                 $.extend({}, listing, {
//                   listPrice: $.number(listing.listPrice, 0),
//                   stateAbbreviation: convertState(listing.address.state, 'abbreviation')
//                 }))
//               );
//             });
//
//             $('#listing-detail').on('show', function() {
//               var $listingDetailImagesContent = $(this).find('.images-content');
//               $listingDetailImagesContent.flexslider({
//                 animation: "slide",
//                 customDirectionNav: $listingDetailImagesContent.next(".custom-navigation").find('a'),
//                 controlNav: false,
//                 easing: "linear"
//               });
//             });
//           });
//
//           map.addLayer(marker);
//           markers.push(marker);
//
//           // Add the results to the search resuls grid
//           $searchResultsGrid.append(
//             _.templateFromUrl('templates/search-result-single.html',
//             $.extend({}, listing, {
//               listPrice: $.number(listing.listPrice, 0),
//               stateAbbreviation: convertState(listing.address.state, 'abbreviation')
//             }))
//           );
//
//         });
//       }
//     });

    polygon = e.layer;
    map.addLayer(e.layer);
  });
});
