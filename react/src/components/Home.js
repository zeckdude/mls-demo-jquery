import React from 'react';
import SearchMap from '../containers/SearchMap';
import SearchFilters from '../containers/SearchFilters';
import SearchResults from '../containers/SearchResults';
import MobileMenu from '../containers/MobileMenu';

export default () => (
  <div>
    <SearchMap />
    <section id="lower-container" className="uk-container uk-padding uk-padding-remove-top uk-remove-padding@m">
      <SearchFilters />
      <SearchResults />
    </section>
    <MobileMenu />
  </div>
);
