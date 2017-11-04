import { SET_SEARCH_PARAMETERS } from '../actions';

const initialState = { properties: {} };

export default (state = initialState, action) => {
  const { properties } = action;

  switch (action.type) {
    case SET_SEARCH_PARAMETERS:
      // Assign the search parameters to state.searchParameters
      return { properties };
    default:
      return state;
  }
};
