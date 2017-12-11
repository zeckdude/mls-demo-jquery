import React, { Component } from 'react';
import { withRouter } from 'react-router';

/**
 * If the route has changed, scroll the window to the top
 * From: https://reacttraining.com/react-router/web/guides/scroll-restoration/scroll-to-top
 */
class ScrollToTop extends Component {
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0);
    }
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
