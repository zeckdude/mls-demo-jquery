import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TimedMessage extends Component {
  constructor(props) {
    super(props);
    this.state = { show: true };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({ show: false });
    }, this.props.timeout);
  }

  render() {
    return this.state.show ?
      <div id="search-confirmation-message" className="uk-fixed-alert uk-alert-success" data-uk-alert>
        <a className="uk-alert-close" data-uk-close />
        <p>{this.props.message}</p>
      </div>
      : null;
  }
}

export default TimedMessage;

TimedMessage.propTypes = {
  message: PropTypes.string.isRequired,
  timeout: PropTypes.number,
};

TimedMessage.defaultProps = {
  timeout: 2500,
};
