import React, { Component } from 'react';
import { Map, Marker, Popup, Polygon } from 'react-leaflet';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import dotProp from 'dot-prop-immutable-chain';
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
      visible: {
        removeShapeButton: false,
        selectedSearchArea: false,
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

  componentWillReceiveProps(nextProps) {
    if (!_isEmpty(nextProps.selectedSearchArea.points)) {
      const updatedState = dotProp.set(this.state, 'visible.selectedSearchArea', true);
      this.setState(updatedState);
    }

    // If the loading status changes (which signifies that the listings have finished fetching)
    if (this.props.loadingStatus !== nextProps.loadingStatus && nextProps.loadingStatus === 'LOADED') {
      // Check if the selected search area is selected
      if (!_isEmpty(nextProps.selectedSearchArea.points)) {
        // Set the removeShapeButton to be visible
        // Using the `dot-prop-immutable` utility to deep copy the state object and assign a new value
        // Equivalent to:
        // {
        //   ...this.state,
        //   visible: {
        //     ...this.state.visible,
        //     removeShapeButton: true
        //   }
        // }
        const updatedState = dotProp.set(this.state, 'visible.removeShapeButton', true);
        this.setState(updatedState);
      }

      // Check if the selected search area is selected
      if (_isEmpty(nextProps.selectedSearchArea.points)) {
        // Set the removeShapeButton to not be visible
        const updatedState = dotProp(this.state)
          .set('visible.removeShapeButton', false)
          .set('visible.selectedSearchArea', false)
          .value();
        this.setState(updatedState);

        // If the shape has been added previously
        // if (!_isEmpty(nextProps.selectedSearchArea.shape)) {
        //   // Remove previously drawn shape from the map
        //   this.props.selectedSearchArea.shape.remove();
        // }
      }
    }
  }

  /**
   * Reset the selected search area properties on the store
   * @return void
   */
  onRemoveShapeButtonClick() {
    // this.props.selectedSearchArea.shape.remove();
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
    return _map(this.props.properties, (listing) => {
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

  renderSelectedArea() {
    if (this.state.visible.selectedSearchArea) {
      return <Polygon positions={this.props.selectedSearchArea.points} opacity="0.5" weight="4" />;
    }
    return false;
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
        {this.renderSelectedArea()}
      </Map>
    );
  }

  /**
   * Render the remove shape button if a shape has been selected
   * @return {ReactElement} - Markup of remove shape button
   */
  renderRemoveShapeButton() {
    if (this.state.visible.removeShapeButton) {
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
  properties: state.listings.properties,
  map: state.map,
  selectedSearchArea: state.selectedSearchArea,
  loadingStatus: state.listings.loadingStatus,
});

export default connect(mapStateToProps, { resetSearchArea, setViewingArea })(SearchMap);

SearchMap.propTypes = {
  resetSearchArea: PropTypes.func.isRequired,
  properties: PropTypes.objectOf(PropTypes.object).isRequired,
  selectedSearchArea: PropTypes.shape({
    points: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};
