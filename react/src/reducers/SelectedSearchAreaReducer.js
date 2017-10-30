import { SELECT_SEARCH_AREA } from '../actions';

const initialState = { points: [], shape: {} };

export default (state = initialState, action) => {
  const { points, shape } = action;

  switch (action.type) {
    case SELECT_SEARCH_AREA:
      // Assign the selected search area points coordinates to state.selectedSearchArea
      return { points, shape };
    default:
      return state;
  }
};
