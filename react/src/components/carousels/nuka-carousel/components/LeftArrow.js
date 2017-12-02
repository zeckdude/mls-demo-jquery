import React, { Component } from 'react';

export default class LeftArrow extends Component {
  shouldComponentUpdate() {
    return false;
  }

  styleArrow() {
    return { userSelect: 'none' };
  }

  render() {
    return (
      <div
        style={this.styleArrow()}
        onClick={this.props.previousSlide}
        className="uk-slidenav uk-icon"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg" width="11" height="20"
          viewBox="0 0 11 20" icon="slidenav-previous" ratio="1"
        >
          <polyline
            fill="none" stroke="#000" strokeWidth="1.2"
            points="10 1 1 10 10 19"
          />
        </svg>
      </div>
    );
  }
}
