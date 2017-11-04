import React, { Component } from 'react';
import { Map, Marker, Popup } from 'react-leaflet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty as _isEmpty, map as _map } from 'lodash';
import { resetSearchArea, setViewingArea } from '../actions';
import CustomTileLayer from '../components/CustomTileLayer';
import SearchControls from './SearchControls';

/**
 * SearchMap Component
 */
class SearchMap extends Component {
  constructor(props) {
    super(props);
    this.onRemoveShapeButtonClick = this.onRemoveShapeButtonClick.bind(this);

    // Map starting position
    // Houston, Texas (Area where the demo data is located)
    this.state = {
      map: {
        center: {
          lat: 29.72,
          lng: -95.35,
        },
        zoom: 10,
      },
    };
  }

  /**
   * Internal event to run after the component has been mounted
   * @return void
   */
  componentDidMount() {
    this.props.setViewingArea(this.getLatLngSetsInViewingArea());
  }

  /**
   * When the remove shape button is clicked, fetch all listings that fit within the map viewing area
   * When the fetch is complete, remove the selected search area shape and reset its properties on the store
   * @return void
   */
  onRemoveShapeButtonClick() {
    // Remove previously drawn shape from the map
    this.props.selectedSearchArea.shape.remove();
    // Reset the state properties for the selected search area
    this.props.resetSearchArea();
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
        center={[this.state.map.center.lat, this.state.map.center.lng]}
        zoom={this.state.map.zoom}
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
   * Render the remove shape button if a shape has been selected
   * @return {ReactElement} - Markup of remove shape button
   */
  renderRemoveShapeButton() {
    if (!_isEmpty(this.props.selectedSearchArea.points)) {
      return (
        <button id="remove-shape-btn" className="uk-position-top-right uk-button uk-button-primary uk-button-small" onClick={this.onRemoveShapeButtonClick}>
          Remove Shape
        </button>
      );
    }

    return false;
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
          {this.renderRemoveShapeButton()}
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
  map: state.map,
  selectedSearchArea: state.selectedSearchArea,
});

export default connect(mapStateToProps, { resetSearchArea, setViewingArea })(SearchMap);

SearchMap.propTypes = {
  resetSearchArea: PropTypes.func.isRequired,
  listings: PropTypes.objectOf(PropTypes.object).isRequired,
  selectedSearchArea: PropTypes.shape({
    points: PropTypes.arrayOf(PropTypes.object).isRequired,
    shape: PropTypes.object.isRequired,
  }).isRequired,
};
