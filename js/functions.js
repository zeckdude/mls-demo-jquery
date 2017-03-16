function getSearchResults(data) {
  var result = [];
  $.ajax({
    url: 'https://api.simplyrets.com/properties',
    data: data,
    async: false,
    beforeSend: function(xhr) {
      // $spinner.show({
      //   complete: function() {
      //     $(this).css('opacity', '1');
      //   }
      // });
      xhr.setRequestHeader("Authorization", "Basic " + btoa("simplyrets:simplyrets"));
    },
    success: function(response) {
      result = response;
    }
  });

  return result;
}

function preLoadImages(photos) {
  $.each(photos, function(i, photo){
    var img = new Image();
    img.src = photo;
  });
}

function createMarkerOnMap(listing, map, markers) {
  // Create a new marker based on the coordinates of the current listing
  var markerLocation = new L.LatLng(listing.geo.lat, listing.geo.lng);
  var marker = new L.Marker(markerLocation);

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
}

function createCardInGrid(listing, $gridElement) {
  $gridElement.append(
    _.templateFromUrl('templates/search-result-single.html',
    $.extend({}, listing, {
      listPrice: $.number(listing.listPrice, 0),
      stateAbbreviation: convertState(listing.address.state, 'abbreviation')
    }))
  );
}

function displaySearchResults(listings, $gridElement, mapReference, markers) {
  // var spinnerTimeOut = setTimeout(function(){
  //   $spinner
  //     .css('opacity', '0')
  //     .on("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",
  //      function(e){
  //         $(this).hide();
  //         $(this).off(e);
  //      });
  //
  //      clearTimeout(spinnerTimeOut);
  // }, 500);

  $gridElement.html('');

  $.each (listings, function (i, listing) {
    //Pre-load images for the current listing
    preLoadImages(listing.photos);

    // Add the marker to the map and bind a popup to it
    createMarkerOnMap(listing, mapReference, markers);

    // Add the card to the search resuls grid
    createCardInGrid(listing, $gridElement);
  });
}
