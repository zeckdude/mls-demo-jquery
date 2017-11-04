import React, { Component } from 'react';

class Expire extends Component {
  constructor(props) {
    super(props);
    this.setTimer = this.setTimer.bind(this);

    this.state = {
      visible: true,
    };
  }

  componentDidMount() {
    this.setTimer();
  }

  componentWillReceiveProps(nextProps) {
    // reset the timer if children are changed
    if (nextProps.children !== this.props.children) {
      this.setTimer();
      this.setState({ visible: true });
    }
  }

  setTimer() {
    // clear any existing timer
    if (this.timer != null) {
      clearTimeout(this.timer);
    }

    // hide after `delay` milliseconds
    this.timer = setTimeout(() => {
      this.setState({ visible: false });
      this.timer = null;
    }, this.props.delay);
  }

  render() {
    return this.state.visible
      ? <div>{this.props.children}</div>
      : <span />;
  }
}

export default Expire;

Expire.defaultProps = {
  delay: 10000,
};
