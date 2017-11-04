import { SET_VIEWING_AREA } from '../actions';

const initialState = { points: [] };

export default (state = initialState, action) => {
  const { points } = action;

  switch (action.type) {
    case SET_VIEWING_AREA:
      // Assign the map viewing area points coordinates to state.map
      return { points };
    default:
      return state;
  }
};
