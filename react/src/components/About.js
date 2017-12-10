import React from 'react';

export default () => (
  <div className="listing-detail">
    <div className="uk-container">
      <div className="listing-detail-content-container">
        <div className="listing-detail-content">
          <div className="listing-detail-content-header uk-padding-small uk-padding-remove-horizontal uk-padding-remove-top">
            <div className="uk-flex uk-flex-column uk-flex-auto uk-flex-1@s">
              <h2 className="uk-margin-remove">About</h2>
              <p className="uk-margin-remove">A little information regarding the developer of this site</p>
            </div>
          </div>

          <div>
            <div className="uk-grid-medium" data-uk-grid>
              <div className="uk-width-1-1">
                <div className="images cut-from-left uk-inline uk-light uk-width-1-1">
                  <div className="images-content">
                    <img src="img/chris-banner.jpg" alt="" />
                  </div>
                </div>
              </div>
              <div className="uk-width-1-1" style={{ marginTop: '20px' }}>
                <div className="uk-card uk-card-body uk-background-white">
                  <h4 className="uk-heading-divider">Who I am</h4>
                  <p>
                    Unfortunately, HomeSearch.com is not a site for any actual company. It is, however, a conceptual site to demonstrate the abilities of its developer, <a href="http://www.chrisseckler.com">Chris Seckler</a>.
                    It is built using HTML, CSS, and JavaScript, as well as the popular React library.
                    It uses an API to access demo MLS data, but can be switched over to use actual MLS data at any moment. Users can search for property listings
                    via the map search tools, search filters, or a combination of both. It is optimized for use on both mobile and desktop environments.
                  </p>
                  <p>
                    If you are looking for a solution for your real estate site, I would love to create the optimal experience for your customers&rsquo; needs.
                    Please <a href="mailto:contact@chrisseckler.com">email Chris Seckler</a>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
