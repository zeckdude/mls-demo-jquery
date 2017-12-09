import React, { Component } from 'react';
import { Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Carousel from './Carousel';
import RouterForwarder from './RouterForwarder';
import { formatCurrency } from '../helpers';

export default class extends Component {
  constructor(props, context) {
    super(props);

    this.renderCarousel = this.renderCarousel.bind(this);
    this.onOpenPopup = this.onOpenPopup.bind(this);
    this.centerMapOnPopup = this.centerMapOnPopup.bind(this);
  }

  // This is necessary so that this component has access to the context
  // https://stackoverflow.com/a/43594791/83916
  // https://stackoverflow.com/a/39755638/83916
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  onOpenPopup() {
    this.centerMapOnPopup();
  }

  /**
   * Center the map on the popup
   * @return void
   */
  centerMapOnPopup() {
    const mapLeafletElement = this.props.map.leafletElement;
    const popupLeafletElement = this.popupDivElement.leafletElement;
    const popupLatLng = popupLeafletElement.getLatLng();
    const popupHeight = popupLeafletElement.getElement().clientHeight;
    const px = mapLeafletElement.project(popupLatLng); // find the pixel location on the map where the popup anchor is
    px.y -= popupHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
    mapLeafletElement.panTo(mapLeafletElement.unproject(px), { animate: true }); // pan to new center
  }

  renderCarousel() {
    return (
      <div className="uk-light">
        <Carousel photos={this.props.photos} />
      </div>
    );
  }

  render() {
    const {
      photos, listPrice, bedrooms, bathsFull, streetNumber, streetName, listingId, mlsId,
    } = this.props;

    return (
      <div>
        <Popup
          onOpen={this.onOpenPopup}
          ref={popupDivElement => this.popupDivElement = popupDivElement}
        >
          <div className="listing-popup-wrapper">
            <div className="photos-container uk-position-relative">
              {this.renderCarousel()}
              <div className="uk-position-bottom uk-width">
                <span className="uk-label uk-position-bottom-left uk-margin-small uk-margin-small-left">{formatCurrency(listPrice)}</span>
                <span className="uk-label uk-position-bottom-right uk-margin-small uk-margin-small-right">{bedrooms} beds <br /> {bathsFull} baths</span>
              </div>
            </div>
            <div className="listing-popup-content">
              <div className="detailed-info">
                <p className="uk-text-bold uk-text-primary uk-text-truncate uk-text-medium">
                  <RouterForwarder context={this.context}>
                    <Link to={`listings/${mlsId}`}>{streetNumber} {streetName}</Link>
                  </RouterForwarder>
                </p>
                <RouterForwarder className="uk-button uk-button-primary uk-margin-small uk-width-1-1 uk-button-small" context={this.context}>
                  <Link to={`listings/${mlsId}`}>View Details</Link>
                </RouterForwarder>
              </div>
              <div className="mls-id uk-flex uk-flex-center uk-text-muted">MLS #{mlsId}</div>
            </div>
          </div>
        </Popup>
      </div>
    );
  }
}
