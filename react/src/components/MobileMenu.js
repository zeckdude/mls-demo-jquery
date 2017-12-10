import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setActiveMobilePanel } from '../actions';

class MobileMenu extends Component {
  constructor(props) {
    super(props);
    this.setActiveMobilePanel = this.setActiveMobilePanel.bind(this);
  }

  setActiveMobilePanel(event) {
    const panelToActivate = event.currentTarget.dataset.panel;
    this.props.setActiveMobilePanel(panelToActivate);
  }

  render() {
    return (
      <div id="mobile-bottom-menu" className="uk-position-bottom-center uk-background-primary uk-flex-center uk-width-1-1">
        <button
          id="mobile-search-button"
          className={`${this.props.activePanel === 'searchFilters' ? 'active' : ''} uk-button uk-button-primary flaticon-magnifying-glass`}
          onClick={this.setActiveMobilePanel}
          data-panel="searchFilters"
        />
        <button
          id="mobile-results-button"
          className={`${this.props.activePanel === 'searchResults' ? 'active' : ''} uk-button uk-button-primary flaticon-interface`}
          onClick={this.setActiveMobilePanel}
          data-panel="searchResults"
        >
          <span className="uk-badge results-num">{this.props.numProperties}</span>
        </button>
        <button
          id="mobile-map-button"
          className={`${this.props.activePanel === 'searchMap' ? 'active' : ''} uk-button uk-button-primary flaticon-world`}
          onClick={this.setActiveMobilePanel}
          data-panel="searchMap"
        />
      </div>
    );
  }
}

/**
 * mapStateToProps which gives the component access to the redux store
 * @return {object} - Mapping of state properties (in the redux store) to prop properties that will be available within the component
 */
const mapStateToProps = state => ({
  numProperties: Object.keys(state.listings.properties).length,
  activePanel: state.mobile.activePanel,
});

export default connect(mapStateToProps, { setActiveMobilePanel })(MobileMenu);
