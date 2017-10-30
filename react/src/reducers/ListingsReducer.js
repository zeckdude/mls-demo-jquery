import { mapKeys as _mapKeys } from 'lodash';
import { FETCH_LISTINGS } from '../actions';

export default (state = {}, action) => {
  switch (action.type) {
    // case FETCH_POST:
    //   // Copy the current state and set a new property with a dynamic key value and the payload as the value
    //   return { ...state, [action.payload.data.id]: action.payload.data };
    case FETCH_LISTINGS:
      // Create a new state object that uses an AJAX request response and grabs the 'id' property from each object in the response to use as its key
      return _mapKeys(action.payload, 'listingId');
    // case CREATE_POST:
    //   // Copy the current state and set a new property with a dynamic key value and the payload as the value
    //   return { ...state, [action.payload.id]: action.payload };
    // case DELETE_POST:
    //   // Copy the current state and delete the property with the specified key
    //   var newState = { ...state };
    //   delete newState[action.payload.id];
    //   return newState;
    default:
      return state;
  }
};
