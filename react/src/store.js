import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

export default function createStoreWithMiddleware() {
  // Add the Redux dev tools and middleware code together
  const enhancers = compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  );

  // Create a store with the reducers and middleware
  const store = createStore(reducers, enhancers);

  return store;
}
