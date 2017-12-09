// This is being used to make it possible to run react-router functions from within components that don't have access to context (which react-router needs to perform its tasks)
// https://stackoverflow.com/a/45143614/83916

import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RouterForwarder extends Component {
  getChildContext() {
    return this.props.context;
  }

  render() {
    return <span className={this.props.className}>{this.props.children}</span>;
  }
}

RouterForwarder.childContextTypes = {
  router: PropTypes.object.isRequired,
};

RouterForwarder.propTypes = {
  context: PropTypes.object.isRequired,
};

export default RouterForwarder;
