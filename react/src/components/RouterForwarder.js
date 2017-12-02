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
