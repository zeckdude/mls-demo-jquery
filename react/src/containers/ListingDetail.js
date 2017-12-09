import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Map, Marker } from 'react-leaflet';
import PropTypes from 'prop-types';
import { withLastLocation } from 'react-router-last-location';
import { get as _get, round as _round } from 'lodash';
import UIkit from 'uikit';
import CustomTileLayer from '../components/CustomTileLayer';
import Carousel from '../components/Carousel';
import { formatCurrency, convertState } from '../helpers';
import { fetchListing } from '../actions';

class ListingDetail extends Component {
  constructor(props) {
    super(props);

    this.renderCarousel = this.renderCarousel.bind(this);
    this.renderAmenities = this.renderAmenities.bind(this);
    this.renderMap = this.renderMap.bind(this);
    this.renderBackButton = this.renderBackButton.bind(this);

    this.state = {
      showMap: false,
      // showBackButton: false,
    };
  }

  componentDidMount() {
    this.props.fetchListing(this.props.match.params.mlsId);
  }

  // componentWillReceiveProps(nextProps) {
  //   console.group('Location Props');
  //   console.log('nextProps.location.pathname', nextProps.location.pathname);
  //   console.log('this.props.location.pathname', this.props.location.pathname);
  //   console.groupEnd();
  //
  //   const routeChanged = nextProps.location !== this.props.location;
  //   this.setState({ showBackButton: routeChanged });
  // }

  componentDidUpdate() {
    // The UIkit grid needs to re-initialized whenever the search results re-rendered
    UIkit.switcher('#features-switcher-nav');
  }

  renderCarousel() {
    return (
      <div className="uk-light">
        <Carousel photos={this.props.property.photos} size="large" />
      </div>
    );
  }

  // renderSlidePhoto(photo, index) {
  //   return <li key={index} className="ratio16_9"><div><img className="uk-width-1-1" src={photo} alt="" /></div></li>;
  // }

  renderAmenities(amenities) {
    const amenitiesArray = amenities.split(',');
    return amenitiesArray.map(this.renderAmenity);
  }

  renderAmenity(amenity, index) {
    return <li key={index} style={{ lineHeight: 1.3 }}><div className="uk-flex"><span className="uk-margin-small-right" data-uk-icon="icon: check" /> {amenity}</div></li>;
  }

  renderBackButton() {
    if (this.props.lastLocation) {
      return <button className="uk-button uk-button-primary uk-button-small uk-margin-bottom" onClick={this.props.history.goBack}>Back to Search Results</button>;
    }
    return false;
  }

  /**
   * Render the map
   * @return {ReactElement} - Markup of map
   */
  renderMap() {
    const { lat, lng } = this.props.property.geo;
    if (this.state.showMap) {
      return (
        <Map
          style={{ width: '100%', height: '100%' }}
          center={[lat, lng]}
          zoom={16}
          maxZoom={18}
          scrollWheelZoom={false}
          zoomControl
          ref={(leafletMap) => { this.map = leafletMap; }}
        >
          <CustomTileLayer mapKey="another" />
          <Marker position={{ lat, lng }} />
        </Map>
      );
    }

    return false;
  }

  render() {
    if (!this.props.property) {
      return false;
    }

    const {
      listPrice,
      address: {
        full: addressFull, streetNumber, streetName, city, state, postalCode, country,
      },
      association: { amenities },
      geo: { marketArea },
      mls: { status: mlsStatus },
      property: {
        area, bedrooms, garageSpaces, bathsFull, yearBuilt,
      },
      remarks,
    } = this.props.property;

    return (
      <div className="listing-detail">
        <div className="uk-container">
          <div className="listing-detail-content-container">
            <div className="listing-detail-content">

              {this.renderBackButton()}

              <div className="listing-detail-content-header uk-padding-small uk-padding-remove-horizontal uk-padding-remove-top">
                <div className="uk-flex uk-flex-column uk-flex-row@s">
                  <div className="uk-flex uk-flex-column uk-flex-auto uk-flex-1@s">
                    <h2 className="uk-margin-remove">{streetNumber} {streetName}</h2>
                    <p className="uk-margin-remove">{city}, {convertState(state, 'abbreviation')} {postalCode}</p>
                  </div>

                  <h4 className="uk-margin-small-top uk-margin-remove-bottom uk-margin-remove@s">{formatCurrency(listPrice)}</h4>
                </div>
              </div>

              <div>
                <div className="uk-grid-medium" data-uk-grid>
                  <div className="uk-width-1-1">
                    <div className="photos-container">
                      {this.renderCarousel()}
                    </div>
                  </div>
                  <div className="uk-width-2-3@m" style={{ marginTop: '20px' }}>
                    <div className="secondary-tab-switcher">
                      <div className="uk-card uk-card-body uk-background-white">
                        <ul id="features-switcher-nav" data-uk-tab>
                          <li><a href="#">Description</a></li>
                          <li><a href="#">Address</a></li>
                          <li><a href="#">Features</a></li>
                          <li><a href="#" onClick={() => { this.setState({ ...this.state, showMap: true }); }}>Map</a></li>
                        </ul>

                        <ul className="uk-switcher uk-margin">
                          <li>
                            <h4 className="uk-heading-divider">Description</h4>
                            <p>{remarks}</p>
                          </li>
                          <li>
                            <h4 className="uk-heading-divider">Address</h4>
                            <ul className="uk-column-1-2 uk-column-1-3@s uk-list">
                              <li><strong>Address: </strong>{addressFull}</li>
                              <li><strong>City: </strong>{city}</li>
                              <li><strong>State: </strong>{state}</li>
                              <li><strong>Zip Code: </strong>{postalCode}</li>
                              <li><strong>Country: </strong>{country}</li>
                              <li><strong>Neighborhood: </strong>{marketArea}</li>
                            </ul>
                          </li>
                          <li>
                            <h4 className="uk-heading-divider">Features</h4>
                            <ul className="uk-column-1-2 uk-column-1-3@s uk-list">
                              { this.renderAmenities(amenities) }
                            </ul>
                          </li>
                          <li>
                            <h4 className="uk-heading-divider">Map</h4>
                            <div className="property-details-map" style={{ width: '100%', height: '350px' }}>
                              {this.renderMap()}
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="uk-width-1-3@m" style={{ marginTop: '20px' }}>
                    <div className="uk-card uk-card-body uk-background-white">
                      <h4 className="uk-heading-divider">Quick Summary</h4>

                      <dl className="left-right-definition-list">
                        <dt>Location</dt>
                        <dd>{city}, {convertState(state, 'abbreviation')} {postalCode}</dd>

                        <dt>Price</dt>
                        <dd><span className="tag price">{formatCurrency(listPrice)}</span></dd>

                        <dt>Status:</dt>
                        <dd>{mlsStatus}</dd>

                        <dt>Year Built:</dt>
                        <dd>{yearBuilt}</dd>

                        <dt>Area:</dt>
                        <dd>{area} Sq Ft</dd>

                        <dt>Beds:</dt>
                        <dd>{bedrooms}</dd>

                        <dt>Baths:</dt>
                        <dd>{bathsFull}</dd>

                        <dt>Garage Spaces:</dt>
                        <dd>{_round(garageSpaces)}</dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
const mapStateToProps = (state, ownProps) => ({
  property: state.listings.properties[ownProps.match.params.mlsId],
});

export default connect(mapStateToProps, { fetchListing })(withLastLocation(ListingDetail));

ListingDetail.propTypes = {
  property: PropTypes.object,
};
