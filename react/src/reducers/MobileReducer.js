import { SET_ACTIVE_MOBILE_PANEL } from '../actions';

const initialState = { activePanel: 'searchMap' };

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_MOBILE_PANEL:
      return { ...state, activePanel: action.panelName };
    default:
      return state;
  }
};
