import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import PropTypes from 'prop-types';
import { selectSearchArea } from '../actions';

class SearchControls extends Component {
  constructor(props) {
    super(props);
    this.onCreate = this.onCreate.bind(this);
  }

  onCreate(e) {
    const polyline = e.layer;
    polyline.remove();

    this.props.selectSearchArea({
      points: polyline.getLatLngs()[0],
    });
  }

  render() {
    return (
      <FeatureGroup>
        <EditControl
          position="topleft"
          onCreated={this.onCreate}
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
