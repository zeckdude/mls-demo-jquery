import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';

const NavBar = props => (
  <header id="main-nav" className="uk-card uk-card-default uk-box-shadow-small">
    <div className="uk-container">
      <div className="uk-flex uk-flex-middle uk-height-1-1">
        <div id="logo">
          <Link className="uk-link-reset" to="/">
            <span className="icon-logo flaticon-hand" />
            <span className="text-logo">HomeSearch.com</span>
          </Link>
        </div>
        <nav id="main-navbar" className="uk-flex-1" data-uk-navbar>
          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">
              <li className={props.location.pathname === '/' ? 'uk-active' : ''}>
                <Link className="uk-text-capitalize" to="/">Home</Link>
              </li>
              <li className={props.location.pathname === '/about/' ? 'uk-active' : ''}>
                <Link className="uk-text-capitalize" to="/about/">About</Link>
              </li>
            </ul>
          </div>
        </nav>
        <nav id="mobile-navbar" className="uk-flex-1" data-uk-navbar>
          <div className="uk-navbar-right">
            <a className="uk-navbar-toggle" href="#" data-uk-toggle="target: #offcanvas-nav">
              <span className="uk-navbar-toggle-icon uk-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                  viewBox="0 0 20 20" icon="navbar-toggle-icon" ratio="1"
                >
                  <rect y="9" width="20" height="2" />
                  <rect y="3" width="20" height="2" />
                  <rect y="15" width="20" height="2" />
                </svg>
              </span>
              <span className="uk-margin-small-left">Menu</span>
            </a>
          </div>
        </nav>
      </div>
    </div>
  </header>
);

export default withRouter(NavBar);
