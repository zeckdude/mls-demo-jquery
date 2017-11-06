import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { isEmpty as _isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { selectSearchArea } from '../actions';

class SearchControls extends Component {
  constructor(props) {
    super(props);
    this.onCreate = this.onCreate.bind(this);
  }

  onCreate(e) {
    const polyline = e.layer;
    // polyline.onRemove = (e) => {
    //   alert('this works');
    // };

    polyline.remove();


    this.props.selectSearchArea({
      points: polyline.getLatLngs()[0],
      // shape: polyline,
    });

    // Remove the drawn shape from the map because the points are being saved in the store and being rendered on the map so they are reactive
    // If I find a method in react-leaflet-draw to get the drawn points without rendering it, I will implement that instead. For now, this is the workaround.
    // polyline.remove();
  }

  _onEditPath(e) {
    console.log('Path edited !');
  }

  _onDeleted(e) {
    console.log('Path deleted !');
  }

  _mounted(drawControl) {
    console.log('Component mounted !');
  }

  _onEditStart() {
    console.log('Edit is starting !');
  }

  _onEditStop() {
    console.log('Edit is stopping !');
  }

  _onDeleteStart() {
    console.log('Delete is starting !');
  }

  _onDeleteStop() {
    console.log('Delete is stopping !');
  }

  render() {
    return (
      <FeatureGroup>
        <EditControl
          position="topleft"
          onEdited={this._onEditPath}
          onCreated={this.onCreate}
          onDeleted={this._onDeleted}
          onMounted={this._mounted}
          onEditStart={this._onEditStart}
          onEditStop={this._onEditStop}
          onDeleteStart={this._onDeleteStart}
          onDeleteStop={this._onDeleteStop}
          edit={{
            edit: false,
            remove: false,
          }}
          draw={{
            polygon: true,
            rectangle: true,
            circle: false,
            marker: false,
            polyline: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>
    );
  }
}

/**
 * mapStateToProps which gives the component access to the redux store
 * @return {object} - Mapping of state properties (in the redux store) to prop properties that will be available within the component
 */
const mapStateToProps = state => ({
  selectedSearchArea: state.selectedSearchArea,
});

export default connect(mapStateToProps, { selectSearchArea })(SearchControls);

SearchControls.propTypes = {
  selectSearchArea: PropTypes.func.isRequired,
  selectedSearchArea: PropTypes.shape({
    points: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};
