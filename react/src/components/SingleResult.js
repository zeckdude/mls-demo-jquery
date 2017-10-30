import React from 'react';
import { round as _round } from 'lodash';

export default ({
  featuredPhoto, streetNumber, streetName, area, bedrooms, garageSpaces, bathsFull, listPrice, listingId,
}) => (
  <div>
    <div className="search-result-single uk-card uk-card-default uk-background-light-grey uk-text-dark-grey">
      <div className="ratio16_9">
        <div>
          <a
            className="js-modal-dialog" data-listing-id={listingId} data-href="listing-detail"
            href="#"
          >
            <img className="uk-width-expand" src={featuredPhoto} alt="" />
          </a>
        </div>
      </div>
      <h4 className="uk-background-primary uk-margin-remove uk-text-white uk-padding-tiny uk-text-truncate">
        <a
          className="js-modal-dialog modal-dialog" data-listing-id={listingId} data-href="listing-detail"
          href="#"
        >
          {streetNumber} {streetName}
        </a>
      </h4>
      <div className="search-results-property-features uk-child-width-expand uk-padding-tiny" data-uk-grid>
        <div>
          <ul className="uk-list">
            <li className="uk-text-truncate">
              <span className="flaticon-select-an-objecto-tool" /> {area} sq ft
            </li>
            <li className="uk-text-truncate">
              <span className="flaticon-bed" /> {bedrooms} Bedrooms
            </li>
          </ul>
        </div>
        <div>
          <ul className="uk-list">
            <li className="uk-text-truncate">
              <span className="flaticon-vehicle-1" /> {_round(garageSpaces)} Garage Spaces
            </li>
            <li className="uk-text-truncate">
              <span className="flaticon-shower" /> {bathsFull} Bathrooms
            </li>
          </ul>
        </div>
      </div>
      <div className="uk-card-footer uk-flex uk-padding-tiny">
        <h5 className="uk-margin-remove uk-text-dark-grey">
          ${listPrice}
        </h5>
        <small className="uk-flex-1 uk-flex uk-flex-bottom uk-flex-right">
          MLS #{listingId}
        </small>
      </div>
    </div>
  </div>
);
