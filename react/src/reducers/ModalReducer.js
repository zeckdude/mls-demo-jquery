import { SHOW_MODAL, HIDE_MODAL, SET_MODAL_CONTENT } from '../actions';

const initialState = { content: '', visible: false };

export default (state = initialState, action) => {
  switch (action.type) {
    case SHOW_MODAL:
      return { content: action.content, visible: true };
    case HIDE_MODAL:
      return { ...state, visible: false };
    case SET_MODAL_CONTENT:
      return { ...state, content: action.content };
    default:
      return state;
  }
};
