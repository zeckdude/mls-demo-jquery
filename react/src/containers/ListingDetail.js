import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { round as _round } from 'lodash';
import Carousel from '../components/Carousel';
import { formatCurrency, convertState } from '../helpers';

class ListingDetail extends Component {
  constructor(props) {
    super(props);

    this.renderCarousel = this.renderCarousel.bind(this);
    this.renderAmenities = this.renderAmenities.bind(this);
  }

  renderCarousel() {
    return (
      <div className="uk-light">
        <Carousel photos={this.props.property.photos} />
      </div>
    );
  }

  // renderSlidePhoto(photo, index) {
  //   return <li key={index} className="ratio16_9"><div><img className="uk-width-1-1" src={photo} alt="" /></div></li>;
  // }

  renderAmenities(amenities) {
    const amenitiesArray = amenities.split(',');
    amenitiesArray.map(this.renderAmenity);
  }

  renderAmenity(amenity, index) {
    return <li key={index} style={{ lineHeight: 1.3 }}><div className="uk-flex"><span className="uk-margin-small-right" data-uk-icon="icon: check" /> {amenity}</div></li>;
  }

  render() {
    const {
      listPrice,
      address: {
        full: addressFull, streetNumber, streetName, city, state, postalCode, country,
      },
      association: { amenities },
      geo: { marketArea },
      mls: { status: mlsStatus },
      photos,
      property: {
        area, bedrooms, garageSpaces, bathsFull, yearBuilt,
      },
    } = this.props.property;

    // const {
    //   streetNumber, streetName, area, bedrooms, garageSpaces, bathsFull, listPrice, listingId,
    // } = this.props.property;

    // return 'asasas';
    //
    console.log('state abbreviation', convertState(state, 'abbreviation'));

    return (
      <div className="listing-detail">
        <div className="listing-detail-content-container">
          <div className="listing-detail-content">

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
                      <ul data-uk-tab>
                        <li><a href="#">Description</a></li>
                        <li><a href="#">Address</a></li>
                        <li><a href="#">Features</a></li>
                        <li><a href="#" id="property-details-map-btn">Map</a></li>
                      </ul>

                      <ul className="uk-switcher uk-margin">
                        <li>
                          <h4 className="uk-heading-divider">Description</h4>
                          {/* <p>{remarks}</p> */}
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
                          <div id="property-details-map" className="property-details-map" style={{ width: '100%', height: '350px' }} />
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
    );
  }
}

/**
 * mapStateToProps which gives the component access to the redux store
 * @return {object} - Mapping of state properties (in the redux store) to prop properties that will be available within the component
 */
const mapStateToProps = (state, ownProps) => ({
  property: state.listings.properties[ownProps.listingId],
});
// const mapStateToProps = (state, ownProps) =>
//   // console.log('yo');
//
//   ({
//     property: state.listings.properties[ownProps.listingId],
//   });
export default connect(mapStateToProps)(ListingDetail);

ListingDetail.propTypes = {
  property: PropTypes.object.isRequired,
};
