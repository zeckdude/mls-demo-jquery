import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { round as _round } from 'lodash';
import { formatCurrency } from '../helpers';

const SingleResult = ({
  featuredPhoto, streetNumber, streetName, area, bedrooms, garageSpaces, bathsFull, listPrice, mlsId, listingId,
}) => (
  <div>
    <div className="search-result-single uk-card uk-card-default uk-background-light-grey uk-text-dark-grey">
      <div className="ratio16_9">
        <div>
          <Link
            to={`listings/${mlsId}`}
          >
            <img className="uk-width-expand" src={featuredPhoto} alt="" />
          </Link>
        </div>
      </div>
      <h4 className="uk-background-primary uk-margin-remove uk-text-white uk-padding-tiny uk-text-truncate">
        <Link
          className="modal-dialog"
          to={`listings/${mlsId}`}
        >
          {streetNumber} {streetName}
        </Link>
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
          {formatCurrency(listPrice)}
        </h5>
        <small className="uk-flex-1 uk-flex uk-flex-bottom uk-flex-right">
          MLS #{mlsId}
        </small>
      </div>
    </div>
  </div>
);

export default SingleResult;

SingleResult.propTypes = {
  featuredPhoto: PropTypes.string.isRequired,
  streetNumber: PropTypes.number.isRequired,
  streetName: PropTypes.string.isRequired,
  area: PropTypes.number.isRequired,
  bedrooms: PropTypes.number.isRequired,
  garageSpaces: PropTypes.number.isRequired,
  bathsFull: PropTypes.number.isRequired,
  listPrice: PropTypes.number.isRequired,
  mlsId: PropTypes.number.isRequired,
};
