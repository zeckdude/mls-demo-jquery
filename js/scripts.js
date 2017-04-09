$(document).ready(function() {
  var $spinner = $('#spinner');
  var $searchResultsGrid = $('#search-results-grid');
  var $noResultsFoundContainer = $('#search-results-not-found-container');
  var $resultsNumContainer = $('.results-num');
  var $searchFormElement = $('#properties-search-form');
  var $searchFormFields = $('#properties-search-form :input');
  var $searchBox = $searchFormElement.parent();
  var $clearFiltersBtn = $('.clear-search-parameters-btn');
  var $mapPanel = $('#map-panel');
  var $searchPanel = $('#search-panel');
  var $removeShapeBtn = $('#remove-shape-btn');
  var $mobileBottomMenu = $('#mobile-bottom-menu');
  var $mobilePanel = $('.mobile-panel');
  var markers = [];
  var shape = null;
  var searchParameters = [];
  var lastClickedMarker = null;
  var searchResults = null;
  var $map = $('#map');

  var map = createMap();

  var hello = 'hello1';

  // Debugging: Show the bounds of the map where properties will be shown for search results when the map tool is not used
  //showMapViewingArea(map);

  $('body').addClass(getOrientation());

  // On Page load, search for all properties on the current map viewing area
  searchResults = performSearch({
    map: map,
    $searchResultsGrid: $searchResultsGrid,
    $noResultsFoundContainer: $noResultsFoundContainer,
    $resultsNumContainer: $resultsNumContainer,
    markers: markers,
    shape: shape,
    searchParameters: searchParameters,
    shouldRemoveMarkers: true
  });

  map.on('draw:created', function (e) {
    // Remove the existing shape and markers
    removeShapeAndMarkers(map, shape, markers);

    // Save the drawn shape for reference
    shape = e.layer;

    // Perform the search
    searchResults = performSearch({
      map: map,
      $searchResultsGrid: $searchResultsGrid,
      $noResultsFoundContainer: $noResultsFoundContainer,
      $resultsNumContainer: $resultsNumContainer,
      markers: markers,
      shape: shape,
      searchParameters: searchParameters,
      shouldRemoveMarkers: false
    });

    // Add the drawn shape to the map
    map.addLayer(shape);

    // Show 'Remove Shape' button
    $removeShapeBtn.removeClass('uk-hidden');
  });

  // When the search parameters form is used to filter search results
  $searchFormElement.on('submit', function(e) {
    e.preventDefault();

    searchParameters = runSearchFilters({
      map: map,
      $searchFormElement: $searchFormElement,
      $searchResultsGrid: $searchResultsGrid,
      $noResultsFoundContainer: $noResultsFoundContainer,
      $resultsNumContainer: $resultsNumContainer,
      markers: markers,
      shape: shape,
      shouldRemoveMarkers: true,
      $clearFiltersBtn: $clearFiltersBtn,
      callback: function() {
        // Hide the Search Panel
        $searchPanel.removeClass('lifted');
        $('#mobile-search-button').removeClass('active');
        $('#mobile-map-button').addClass('active');
      }
    });
  });

  // Change disabled attribute on search box submit button depending on if there is a value in any field
  $searchFormFields.on('change keyup', function() {
    $('#search-box-search-btn').prop("disabled", true);
    $searchFormFields.each(function() {
      if( $(this).val().length > 0 ) {
        $('#search-box-search-btn').prop("disabled", false);
        return false; // break the loop
      }
    });
  });

  // Submit form when the value of a field changes
  $searchFormFields.on('change', function() {
    searchParameters = runSearchFilters({
      map: map,
      $searchFormElement: $searchFormElement,
      $searchResultsGrid: $searchResultsGrid,
      $noResultsFoundContainer: $noResultsFoundContainer,
      $resultsNumContainer: $resultsNumContainer,
      markers: markers,
      shape: shape,
      shouldRemoveMarkers: true,
      $clearFiltersBtn: $clearFiltersBtn,
      callback: function() {
        // Display success message at the top of the search panel
        if ($('#search-confirmation-message').length === 0) {
          $('#search-panel-container').prepend('<div id="search-confirmation-message" class="uk-fixed-alert uk-alert-success" uk-alert><a class="uk-alert-close" uk-close></a><p>Your filters have been updated.</p></div>');
          setTimeout(function(){
            $('#search-confirmation-message').find('.uk-alert-close').trigger('click');
          }, 2500);
        }
      }
    });
  });

  $(document).on('click', '.clear-search-parameters-btn', function() {
    $searchFormElement[0].reset();
    $('#search-box-search-btn').prop("disabled", true);
    searchParameters = [];

    // Perform a search based on default search criteria
    searchResults = performSearch({
      map: map,
      $searchResultsGrid: $searchResultsGrid,
      $noResultsFoundContainer: $noResultsFoundContainer,
      $resultsNumContainer: $resultsNumContainer,
      markers: markers,
      shape: shape,
      searchParameters: searchParameters,
      shouldRemoveMarkers: true
    });

    // Hide the Clear Filters Button
    $clearFiltersBtn.addClass('uk-hidden');

    // Hide the Search Panel
    $searchPanel.removeClass('lifted');
    $('#mobile-search-button').removeClass('active');
    $('#mobile-map-button').addClass('active');
  });

  $mapPanel.on('click', '#remove-shape-btn', function() {
    removeShapeAndMarkers(map, shape, markers);
    shape = null;
    searchResults = performSearch({
      map: map,
      $searchResultsGrid: $searchResultsGrid,
      $noResultsFoundContainer: $noResultsFoundContainer,
      $resultsNumContainer: $resultsNumContainer,
      markers: markers,
      shape: shape,
      searchParameters: searchParameters,
      shouldRemoveMarkers: false
    });
    $(this).addClass('uk-hidden');
  });

  // function toggleFiltersBtn() {
  //   $('#toggle-filters-btn').text(function(i, text){
  //     return text === "Show Filters" ? "Hide Filters" : "Show Filters";
  //   });
  //   $('#lower-container').toggleClass('show-lower-container-mobile');
  // }

  // $('#toggle-filters-btn').on('click', function() {
  //   toggleFiltersBtn();
  // });

  $mobileBottomMenu.on('click', 'button', function() {
    var $clickedButton = $(this);
    var panelToShowSelector = $clickedButton.attr('data-panel');

    $mobilePanel.removeClass('lifted');
    $mobileBottomMenu.children().removeClass('active');

    $(panelToShowSelector).addClass('lifted');
    $clickedButton.addClass('active');

    // Trigger a resize so that UI kit grid updates the margins programmatically
    $(window).trigger("resize");
  });

  window.addEventListener("orientationchange", function() {
    $('body').removeClass('portrait landscape').addClass(getOrientation());
  }, false);

  if ('ontouchmove' in window) {
    $(document).on('focus', 'textarea,input,select', function() {
      //alert('h');
      window.scrollTo(0, 0);
      document.body.scrollTop = 0;
    });
  }

  $(document).on('click', '.js-modal-dialog', function (e) {
    e.preventDefault();
    $modalDialogBtn = $(this);
    $modalDialogBtn.blur();
    var modalHref = $modalDialogBtn.attr('data-href');

    if (modalHref === 'about') {
      var modal = UIkit.modal.dialog(_.templateFromUrl('templates/about.html'));
      var $modal = modal.$el;
      $modal.addClass('listing-detail-modal');
    }

    if (modalHref === 'listing-detail') {
      var listingId = $modalDialogBtn.attr('data-listing-id');
      var listing = $.grep(searchResults, function (e) {
        return e.listingId == listingId;
      })[0];
      var modal = UIkit.modal.dialog(_.templateFromUrl('templates/listing-detail-content.html',
        $.extend({}, listing, {
          listPrice: $.number(listing.listPrice, 0),
          stateAbbreviation: convertState(listing.address.state, 'abbreviation'),
          amenitiesSplit: listing.association.amenities.split(',')
        })
      ));

      var $modal = modal.$el;
      $modal.addClass('listing-detail-modal');

      var $listingDetailImagesContent = $modal.find('.images-content');
      $listingDetailImagesContent.flexslider({
        animation: "slide",
        customDirectionNav: $listingDetailImagesContent.next(".custom-navigation").find('a'),
        controlNav: false,
        easing: "linear"
      });

      // If the map is loaded when its container is hidden, the tiles don't load correctly.
      // It is difficult to listen for when the map tab is clicked, so instead just listen for the click on the tab and set a short timeout before loading the map
      $(document).on('click', '#property-details-map-btn', function () {
        $propertyDetailsMap = $modal.find('.property-details-map');

        setTimeout(function () {

          // If the map was already initialized previously, remove that instance before creating it again
          if (typeof propertyDetailsMap !== 'undefined') {
            propertyDetailsMap.remove();
          }

          propertyDetailsMap = new L.Map($propertyDetailsMap[0], {
            layers: [getTileLayer('another')],
            center: new L.LatLng(listing.geo.lat, listing.geo.lng),
            zoom: 16,
            maxZoom: 18,
            zoomControl: true,
            scrollWheelZoom: false
          });

          var markerLocation = new L.LatLng(listing.geo.lat, listing.geo.lng);
          var marker = new L.Marker(markerLocation);
          propertyDetailsMap.addLayer(marker);
        }, 1);
      });
    }
  });

  function toggleMapTallClass() {
    $map.toggleClass('map-short', $map.height() < 500);
  }

  toggleMapTallClass();

  $(window).onDelayed('resize',200,function(){
    toggleMapTallClass();
  });

});
