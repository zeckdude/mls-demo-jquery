import React from 'react';
import PropTypes from 'prop-types';


/**
 * Inject context to a component (https://stackoverflow.com/a/43594791/83916)
 * @param  {[type]} WrappedComponent [description]
 * @param  {[type]} context          [description]
 * @return {[type]}                  [description]
 */
export function withContext(WrappedComponent, context) {
  class ContextProvider extends React.Component {
    getChildContext() {
      return context;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  ContextProvider.childContextTypes = {};
  Object.keys(context).forEach((key) => {
    ContextProvider.childContextTypes[key] = PropTypes.any.isRequired;
  });

  return ContextProvider;
}
