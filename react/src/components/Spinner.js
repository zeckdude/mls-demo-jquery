import React from 'react';

export default props => {
  return (
    <div id="spinner" className="uk-overlay-primary">
      <div className="uk-position-center">
        <span data-uk-spinner />
      </div>
    </div>
  );
};
