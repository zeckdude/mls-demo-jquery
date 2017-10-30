import React, { Component } from 'react';
import UIkit from 'uikit';
import Spinner from './Spinner';
import NavBarOffCanvas from './NavBarOffCanvas';
import NavBar from './NavBar';
import SearchMap from '../containers/SearchMap';
import SearchFilters from '../containers/SearchFilters';
import SearchResults from '../containers/SearchResults';

const App = () => (
  <div>
    <Spinner />
    <NavBarOffCanvas />

    <div id="page-container">
      <NavBar />
      <SearchMap />
      <section id="lower-container" className="uk-container uk-padding uk-padding-remove-top uk-remove-padding@m">
        <SearchFilters />
        <SearchResults />
      </section>
    </div>
  </div>
);

export default App;
