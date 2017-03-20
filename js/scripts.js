$(document).ready(function() {
  var $spinner = $('#spinner');
  var $searchResultsGrid = $('#search-results-grid');
  var $searchFormElement = $('#properties-search-form');
  var $searchBox = $searchFormElement.parent();
  var markers = [];
  var shape = null;
  var searchParameters = [];

  var map = createMap();

  // Debugging: Show the bounds of the map where properties will be shown for search results when the map tool is not used
  //showMapViewingArea(map);

  // On Page load, search for all properties on the current map viewing area
  performSearch(map, $searchResultsGrid, markers, shape, searchParameters, true);

  map.on('draw:created', function (e) {
    // Remove the existing shape and markers
    removeShapeAndMarkers(map, shape, markers);

    // Save the drawn shape for reference
    shape = e.layer;

    // Perform the search
    performSearch(map, $searchResultsGrid, markers, shape, searchParameters, false);

    // Add the drawn shape to the map
    map.addLayer(shape);

    // Add 'Remove Shape' button above the search box
    $searchBox.prepend('<button id="remove-shape-btn" class="uk-position-top-right uk-button uk-button-primary">Remove Shape</button>');
  });

  // When the search parameters form is used to filter search results
  $('#properties-search-form').on('submit', function(e) {
    e.preventDefault();

    // Only add the filters if any were chosen (remove this when validation is added to the form)
    //if (searchParameters.length > 0) {
      // Save the chosen search parameters for reference
      searchParameters = getArraySearchFormValues($searchFormElement);

      // Perform the search
      performSearch(map, $searchResultsGrid, markers, shape, searchParameters, true);

      // Add 'Clear Filters' button above the search box
      $searchBox.prepend('<button id="clear-search-parameters-btn" class="uk-position-top-left uk-button uk-button-primary">Clear Filters</button>');
    //}
  });

  // Change disabled attribute on search box submit button depending on if there is a value in any field
  $('#properties-search-form :input').on('change keyup', function() {
    $('#search-box-search-btn').prop("disabled", true);
    $('#properties-search-form :input').each(function() {
      if( $(this).val().length > 0 ) {
        $('#search-box-search-btn').prop("disabled", false);
        return false; // break the loop
      }
    });
  });

  $searchBox.on('click', '#clear-search-parameters-btn', function() {
    $searchFormElement[0].reset();
    $('#search-box-search-btn').prop("disabled", true);
    searchParameters = [];
    performSearch(map, $searchResultsGrid, markers, shape, searchParameters, true);
    $(this).remove();
  });

  $searchBox.on('click', '#remove-shape-btn', function() {
    removeShapeAndMarkers(map, shape, markers);
    shape = null;
    performSearch(map, $searchResultsGrid, markers, shape, searchParameters, false);
    $(this).remove();
  });
});
