import React from 'react';

export default () => (
  <div id="offcanvas-nav" data-uk-offcanvas="mode: slide; overlay: true">
    <div className="uk-offcanvas-bar">
      <ul className="uk-nav uk-nav-default">
        <li className="uk-active">
          <a className="uk-text-capitalize" href="#">Home</a>
        </li>
        <li>
          <a className="uk-text-capitalize js-modal-dialog" data-href="about" href="#">About</a>
        </li>
      </ul>
    </div>
  </div>
);
