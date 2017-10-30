import React, { Component } from 'react';

export default class SearchFilters extends Component {
  constructor(props) {
    super(props);
    console.log('aaa');
  }

  render() {
    return (
      <div id="search-panel" className="mobile-panel">
        <div id="search-panel-container" className="uk-padding-small">
          <div className="uk-heading-divider uk-flex uk-flex-top uk-margin-bottom">
            <h3 className="uk-flex-1 uk-margin-remove-bottom">Filter Search </h3>
            <button className="uk-hidden uk-button uk-button-primary uk-button-small clear-search-parameters-btn">Clear Filters</button>
          </div>
          <div id="search-box" className="uk-padding-small uk-card uk-card-default uk-box-shadow-small uk-remove-margin-top@m">
            <form id="properties-search-form" className="uk-grid-small uk-form-stacked" data-uk-grid>
              <div className="uk-width-1-3@s uk-width-1-4@m">
                <label className="uk-form-label" htmlFor="search-box-keyword-field">Keyword</label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input" id="search-box-keyword-field" name="q"
                    type="text" placeholder="Any Keyword"
                  />
                </div>
              </div>
              <div className="uk-width-1-3@s uk-width-1-4@m">
                <label className="uk-form-label" htmlFor="search-box-status-field">Property Status</label>
                <div className="uk-form-controls">
                  <select className="uk-select" id="search-box-status-field" name="status">
                    <option value="">Any Status</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Closed">Closed</option>
                    <option value="ActiveUnderContract">Active - Under Contract</option>
                    <option value="Hold">Hold</option>
                    <option value="Expired">Expired</option>
                    <option value="Delete">Delete</option>
                    <option value="Incomplete">Incomplete</option>
                    <option value="ComingSoon">Coming Soon</option>
                  </select>
                </div>
              </div>
              <div className="uk-width-1-3@s uk-width-1-4@m">
                <label className="uk-form-label" htmlFor="search-box-type-field">Property Type</label>
                <div className="uk-form-controls">
                  <select className="uk-select" id="search-box-type-field" name="type">
                    <option value="">Any Type</option>
                    <option value="residential">Residential</option>
                    <option value="rental">Rental</option>
                    <option value="multifamily">Multi-Family</option>
                    <option value="condominium">Condominium</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>
              </div>
              <div className="uk-width-1-3@s uk-width-1-4@m">
                <label className="uk-form-label" htmlFor="search-box-rooms-field">Min Rooms</label>
                <div className="uk-form-controls">
                  <select className="uk-select" id="search-box-rooms-field" name="minbeds">
                    <option value="">Any Rooms</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                  </select>
                </div>
              </div>
              <div className="uk-width-1-3@s uk-width-1-6@m">
                <label className="uk-form-label" htmlFor="search-box-baths-field">Min Baths</label>
                <div className="uk-form-controls">
                  <select className="uk-select" id="search-box-baths-field" name="minbaths">
                    <option value="">Any Bathrooms</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                  </select>
                </div>
              </div>
              <div className="uk-width-1-3@s uk-width-1-6@m">
                <label className="uk-form-label" htmlFor="search-box-minprice-field">Min Price</label>
                <div className="uk-form-controls uk-form-group">
                  <div className="uk-input-group-addon">$</div>
                  <input
                    className="uk-input" id="search-box-minprice-field" type="text"
                    placeholder="No Min Price" name="minprice"
                  />
                </div>
              </div>
              <div className="uk-width-1-3@s uk-width-1-6@m">
                <label className="uk-form-label" htmlFor="search-box-maxprice-field">Max Price</label>
                <div className="uk-form-controls uk-form-group">
                  <div className="uk-input-group-addon">$</div>
                  <input
                    className="uk-input" id="search-box-maxprice-field" type="text"
                    placeholder="No Max Price" name="maxprice"
                  />
                </div>
              </div>
              <div className="uk-width-1-3@s uk-width-1-6@m">
                <label className="uk-form-label" htmlFor="search-box-minarea-field">Min Area <small className="uk-text-muted">(sq ft)</small></label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input" id="search-box-minarea-field" type="text"
                    placeholder="No Min Area" name="minarea"
                  />
                </div>
              </div>
              <div className="uk-width-1-3@s uk-width-1-6@m">
                <label className="uk-form-label" htmlFor="search-box-maxarea-field">Max Area <small className="uk-text-muted">(sq ft)</small></label>
                <div className="uk-form-controls">
                  <input
                    className="uk-input" id="search-box-maxarea-field" type="text"
                    placeholder="No Max Area" name="maxarea"
                  />
                </div>
              </div>
              <div className="uk-width-expand@s uk-width-1-6@m">
                <button className="uk-button uk-button-primary uk-width-1-1" id="search-box-search-btn" disabled>Search</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
