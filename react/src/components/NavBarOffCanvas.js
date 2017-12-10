import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import UIkit from 'uikit';

class NavBarOffCanvas extends Component {
  onNavLinkClick() {
    UIkit.offcanvas('#offcanvas-nav').hide();
  }

  render() {
    return (
      <div id="offcanvas-nav" data-uk-offcanvas="mode: slide; overlay: true">
        <div className="uk-offcanvas-bar">
          <ul className="uk-nav uk-nav-default">
            <li className={this.props.location.pathname === '/' ? 'uk-active' : ''}>
              <Link className="uk-text-capitalize" to="/" onClick={this.onNavLinkClick}>Home</Link>
            </li>
            <li className={this.props.location.pathname === '/about/' ? 'uk-active' : ''}>
              <Link className="uk-text-capitalize" to="/about/" onClick={this.onNavLinkClick}>About</Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(NavBarOffCanvas);
