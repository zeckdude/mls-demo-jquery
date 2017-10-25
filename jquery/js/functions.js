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

function getOrientation() {
  if(window.innerHeight > window.innerWidth){
    // Portrait orientation
    return 'portrait';
  } else {
    // Landscape orientation
    return 'landscape';
  }
}

function preLoadImages(photos) {
  $.each(photos, function(i, photo){
    var img = new Image();
    img.src = photo;
  });
}

function createMap() {
  var map = new L.Map('map', {
    layers: [getTileLayer('another')],
    center: new L.LatLng(29.72, -95.35),
    zoom: 10,
    maxZoom: 18,
    zoomControl: false,
    scrollWheelZoom: false
  });

  // Add the zoom control manually at a specified position on the map
  var zoomControl = L.control.zoom({
      position: 'topleft'
  });
  map.addControl(zoomControl);

  // Add draw toolbar to the map
  var drawnItems = new L.FeatureGroup();
  var drawControl = new L.Control.Draw({
    position: 'topleft',
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

  return map;
}

function removeShapeAndMarkers(map, shape, markers) {
  removeMarkers(map, markers);
  removeShape(map, shape);
}

function removeMarkers(map, markers) {
  // Remove markers
  $.each (markers, function (i) {
    map.removeLayer(markers[i])
  });
}

function removeShape(map, shape) {
  // Remove shape
  if (shape != null) {
    map.removeLayer (shape);
  }
}

function getArraySearchFormValues($searchFormElement) {
  return $searchFormElement.find(":input").filter(function () { return $.trim(this.value).length > 0; }).serializeArray();
}

function getShapeBounds(shape) {
  return $.map(shape.getLatLngs()[0], function(point) {
    return { name: "points", value: point.lat + "," + point.lng };
  });
}

function getMapBoundsInViewingArea(map) {
  var data = [];
  // var mapBounds = {
  //   northWest: { lat: map.getBounds().getNorthWest().lat - .05, lng: map.getBounds().getNorthWest().lng + .05 },
  //   northEast: { lat: map.getBounds().getNorthEast().lat - .05, lng: map.getBounds().getNorthEast().lng - .25 },
  //   southEast: { lat: map.getBounds().getSouthEast().lat + .12, lng: map.getBounds().getSouthEast().lng - .25 },
  //   southWest: { lat: map.getBounds().getSouthWest().lat + .12, lng: map.getBounds().getSouthWest().lng + .05 }
  // };

  var mapBounds = {
    northWest: { lat: map.getBounds().getNorthWest().lat, lng: map.getBounds().getNorthWest().lng },
    northEast: { lat: map.getBounds().getNorthEast().lat, lng: map.getBounds().getNorthEast().lng },
    southEast: { lat: map.getBounds().getSouthEast().lat, lng: map.getBounds().getSouthEast().lng },
    southWest: { lat: map.getBounds().getSouthWest().lat, lng: map.getBounds().getSouthWest().lng }
  };

  $.each (mapBounds, function (i, latLngSet) {
    data.push({
      name: 'points',
      value: latLngSet.lat + ',' + latLngSet.lng,
      data: {
        lat: latLngSet.lat,
        lng: latLngSet.lng
      }
    });
  });

  return data;
}

function showMapViewingArea(map) {
  // Verify corners of map
  var mapBounds = getMapBoundsInViewingArea(map);

  $.each (mapBounds, function (i, latLngSet) {
    var markerLocation = new L.LatLng(latLngSet.data.lat, latLngSet.data.lng);
    var marker = new L.Marker(markerLocation, {icon: L.spriteIcon('green')});
    map.addLayer(marker);
  });
}

function performSearch(options) {
  var data;
  var searchBounds;
  var searchResults;
  var map = options.map;
  var $searchResultsGrid = options.$searchResultsGrid;
  var $noResultsFoundContainer = options.$noResultsFoundContainer;
  var $resultsNumContainer = options.$resultsNumContainer;
  var markers = options.markers;
  var shape = options.shape;
  var searchParameters = options.searchParameters;
  var shouldRemoveMarkers = options.shouldRemoveMarkers;

  // 1. Remove the existing markers if necessary
  if (shouldRemoveMarkers) {
    removeMarkers(map, markers);
  }

  // 2. Determine the bounds of the search
  if (shape != null) {
    // If the shape has been drawn already, use the shape as the bounds of the search
    searchBounds = getShapeBounds(shape);
  } else {
    // Otherwise use the map as the bounds of the search
    searchBounds = getMapBoundsInViewingArea(map);
  }

  // 3. Combine the determined bounds and search parameters (if they are set)
  data = $.merge( $.merge( [], searchBounds ), searchParameters );

  // 4. Request the search results
  searchResults = getSearchResults(data);

  // 5. Display the search results on the map and grid
  displaySearchResults({
    searchResults: searchResults,
    $searchResultsGrid: $searchResultsGrid,
    $noResultsFoundContainer: $noResultsFoundContainer,
    $resultsNumContainer: $resultsNumContainer,
    map: map,
    markers: markers
  });

  // 6. Return the search results
  return searchResults;
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
      })
    ),
    {
      maxWidth: 'auto',
      closeButton: true
    }
  );

  // When the popup opens after a user clicks it, perform a series of operations
  marker.on('popupopen', function (e) {
    var popup = e.popup;
    var $popup = $(popup.getElement());
    var $imagesContent = $popup.find('.images-content');

    // Sometimes the images haven't been added to the cache by the time the popup is clicked to open which causes issues since it can't compute the container size. This detects the issue and re-calculates the popup. This issue happens alot when you are in desktop mode and switch to mobile mode or vice versa.
    if ($imagesContent.width() === 0) {
      popup.update();
      console.log('updated popup because of no width found for images');
    }

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

    // Re-calculate the leaflet div widths based on whether it is in landscape or portrait mode
    window.addEventListener("orientationchange", function() {
      popup.update();
    }, false);
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

function displaySearchResults(options) {
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
  var listings = options.searchResults;
  var $gridElement = options.$searchResultsGrid;
  var $noResultsFoundContainer = options.$noResultsFoundContainer;
  var $resultsNumContainer = options.$resultsNumContainer;
  var mapReference = options.map;
  var markers = options.markers;
  var numListings = listings.length;

  $gridElement.html('');
  $noResultsFoundContainer.html('');

  $resultsNumContainer.html(numListings);

  if (numListings > 0) {
    $.each (listings, function (i, listing) {
      //Pre-load images for the current listing
      preLoadImages(listing.photos);

      // Add the marker to the map and bind a popup to it
      createMarkerOnMap(listing, mapReference, markers);

      // Add the card to the search resuls grid
      createCardInGrid(listing, $gridElement);
    });
  } else {
    $noResultsFoundContainer.html('<p>There was no results found with the provided filters and/or in the marked search area. Please broaden your search to view listings.</p>');
  }
}

function runSearchFilters(options) {
  var map = options.map;
  var $searchFormElement = options.$searchFormElement;
  var $searchResultsGrid = options.$searchResultsGrid;
  var $noResultsFoundContainer = options.$noResultsFoundContainer;
  var $resultsNumContainer = options.$resultsNumContainer;
  var markers = options.markers;
  var shape = options.shape;
  var shouldRemoveMarkers = options.shouldRemoveMarkers;
  var callback = options.callback;
  var $clearFiltersBtn = options.$clearFiltersBtn;

  // Save the chosen search parameters for reference
  var searchParameters = getArraySearchFormValues($searchFormElement);

  // Perform the search
  performSearch({
    map: map,
    $searchResultsGrid: $searchResultsGrid,
    $noResultsFoundContainer: $noResultsFoundContainer,
    $resultsNumContainer: $resultsNumContainer,
    markers: markers,
    shape: shape,
    searchParameters: searchParameters,
    shouldRemoveMarkers: shouldRemoveMarkers
  });

  callback();

  // Show 'Clear Filters' button
  $clearFiltersBtn.removeClass('uk-hidden');

  return searchParameters;
}
