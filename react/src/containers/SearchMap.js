import React, { Component } from 'react';
import { Map, Marker, Popup } from 'react-leaflet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty as _isEmpty, map as _map } from 'lodash';
import { fetchListings } from '../actions';
import CustomTileLayer from '../components/CustomTileLayer';
import SearchControls from './SearchControls';

/**
 * SearchMap Component
 */
class SearchMap extends Component {
  constructor(props) {
    super(props);

    // Map starting position
    // Houston, Texas (Area where the demo data is located)
    this.state = {
      lat: 29.72,
      lng: -95.35,
      zoom: 10,
    };
  }

  /**
   * Internal event to run after the component has been mounted
   * @return void
   */
  componentDidMount() {
    const searchAreaPointsQueryString = this.createPointsQueryString(this.getLatLngSetsInViewingArea());
    this.props.fetchListings(searchAreaPointsQueryString);
  }

  /**
   * Internal event to run after any state that this component is using has been updated and the component has been re-rendered
   * @return void
   */
  componentDidUpdate(prevProps) {
    // Make sure that the props are actually updated, since componentDidUpdate will also run when the component is mounted
    if (prevProps.selectedSearchArea.points !== this.props.selectedSearchArea.points) {
      const searchAreaPointsQueryString = this.createPointsQueryString(this.getSearchLatLngSets());
      this.props.fetchListings(searchAreaPointsQueryString);
    }
  }

  /**
   * Get the four latitude/longitude coordinate sets for the corner points of the map
   * @return {[object]} - An array of objects for each point with its latitude and longitude coordinates
   */
  getLatLngSetsInViewingArea() {
    const mapBoundsData = this.map.leafletElement.getBounds();
    const northWestCoordinates = mapBoundsData.getNorthWest();
    const northEastCoordinates = mapBoundsData.getNorthEast();
    const southWestCoordinates = mapBoundsData.getSouthWest();
    const southEastCoordinates = mapBoundsData.getSouthEast();

    return [
      { lat: northWestCoordinates.lat, lng: northWestCoordinates.lng },
      { lat: northEastCoordinates.lat, lng: northEastCoordinates.lng },
      { lat: southWestCoordinates.lat, lng: southWestCoordinates.lng },
      { lat: southEastCoordinates.lat, lng: southEastCoordinates.lng },
    ];
  }

  /**
   * Determine whether the map's viewing area or the selected search area should be used to provide the approprate latitude/longitude sets
   * @return {[type]} An array of objects for each point with its latitude and longitude coordinates
   */
  getSearchLatLngSets() {
    // If a search area is not selected with the search shapes tools, then use the map's viewing area coordinates
    if (_isEmpty(this.props.selectedSearchArea.points)) {
      return this.getLatLngSetsInViewingArea();
    }

    // Otherwise use the selected search area's coordinates
    return this.props.selectedSearchArea.points;
  }

  /**
   * Create encoded URL string for all points of an area on a map
   * @param  {[object]} LatLngSets - An array of objects for each point with its latitude and longitude coordinates
   * @example <caption>Example usage of createPointsQueryString.</caption>
   * let LatLngSets = [
   *   { lat: 29.969211659636688, lng: -96.21826171875001 },
   *   { lat: 29.969211659636688, lng: -94.48104858398439 },
   *   { lat: 29.470687864832556, lng: -96.21826171875001 },
   *   { lat: 29.470687864832556, lng: -94.48104858398439 }
   * ]
   * SearchMap.createPointsQueryString(pointsCoordinateSets);
   * // returns "points=29.969211659636688,-96.21826171875001&points=29.969211659636688,-94.48104858398439&points=29.470687864832556,-96.21826171875001&points=29.470687864832556,-94.48104858398439"
   * @return {string} - URL encoded string of all points
   */
  createPointsQueryString(LatLngSets) {
    return `?${_map(LatLngSets, (latLngSet) => {
      const { lat, lng } = latLngSet;
      return `points=${encodeURIComponent(lat)},${encodeURIComponent(lng)}`;
    }).join('&')}`;
  }

  /**
   * Render a marker on the map
   * @return {ReactElement} - Markup of marker and its associated popup
   */
  renderMarkers() {
    return _map(this.props.listings, (listing) => {
      const { listingId, geo: { lat, lng } } = listing;

      return (
        <Marker key={listingId} position={{ lat, lng }}>
          <Popup>
            <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
          </Popup>
        </Marker>
      );
    });
  }

  /**
   * Render the map
   * @return {ReactElement} - Markup of map
   */
  renderMap() {
    return (
      <Map
        center={[this.state.lat, this.state.lng]}
        zoom={this.state.zoom}
        maxZoom={18}
        id="map"
        className="map"
        scrollWheelZoom={false}
        zoomControl
        ref={(leafletMap) => { this.map = leafletMap; }}
      >
        <CustomTileLayer mapKey="another" />
        <SearchControls />
        {this.renderMarkers()}
      </Map>
    );
  }

  /**
   * Render the component
   * @return {ReactElement} - Markup of component
   */
  render() {
    return (
      <div>
        <div id="map-panel" className="uk-position-relative">
          {this.renderMap()}

          <button id="remove-shape-btn" className="uk-hidden uk-position-top-right uk-button uk-button-primary uk-button-small">
            Remove Shape
          </button>
          <div id="mobile-bottom-menu" className="uk-position-bottom-center uk-container uk-background-primary uk-flex-center uk-width-1-1">
            <button id="mobile-search-button" className="uk-button uk-button-primary flaticon-magnifying-glass" data-panel="#search-panel" />
            <button id="mobile-results-button" className="uk-button uk-button-primary flaticon-interface" data-panel="#search-results-panel">
              <span className="uk-badge results-num">0</span>
            </button>
            <button id="mobile-map-button" className="uk-button uk-button-primary flaticon-world active" />
          </div>
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps which gives the component access to the redux store
 * @return {object} - Mapping of state properties (in the redux store) to prop properties that will be available within the component
 */
const mapStateToProps = state => ({
  listings: state.listings,
  selectedSearchArea: state.selectedSearchArea,
});

export default connect(mapStateToProps, { fetchListings })(SearchMap);

SearchMap.propTypes = {
  fetchListings: PropTypes.func.isRequired,
  listings: PropTypes.objectOf(PropTypes.object).isRequired,
  selectedSearchArea: PropTypes.shape({
    points: PropTypes.arrayOf(PropTypes.object).isRequired,
    shape: PropTypes.object.isRequired,
  }).isRequired,
};
