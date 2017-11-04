import React, { Component } from 'react';
import PropTypes from 'prop-types';

const Alert = props => (
  <div id="search-confirmation-message" className="uk-fixed-alert uk-alert-success" data-uk-alert>
    <a className="uk-alert-close" data-uk-close />
    <p>{props.message}</p>
  </div>
);

export default Alert;

Alert.propTypes = {
  message: PropTypes.string.isRequired,
};
