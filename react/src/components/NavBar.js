import React from 'react';

export default () => (
  <header id="main-nav" className="uk-card uk-card-default uk-box-shadow-small">
    <div className="uk-container">
      <div className="uk-flex uk-flex-middle uk-height-1-1">
        <div id="logo">
          <span className="icon-logo flaticon-hand" />
          <span className="text-logo">HomeSearch.com</span>
        </div>
        <nav id="main-navbar" className="uk-flex-1" data-uk-navbar>
          <div className="uk-navbar-right">
            <ul className="uk-navbar-nav">
              <li className="uk-active">
                <a className="uk-text-capitalize" href="#">
                    Home
                </a>
              </li>
              <li>
                <a className="uk-text-capitalize js-modal-dialog" data-href="about" href="#">
                    About
                </a>
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
