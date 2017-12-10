import axios from 'axios';
import { ROOT_URL, AUTH_HEADER } from '../config/api/simplyrets';

export const FETCH_LISTINGS = 'FETCH_LISTINGS';
export const FETCH_LISTINGS_COMPLETE = 'FETCH_LISTINGS_COMPLETE';
export const FETCH_LISTING = 'FETCH_LISTING';
export const SELECT_SEARCH_AREA = 'SELECT_SEARCH_AREA';
export const RESET_SEARCH_AREA = 'RESET_SEARCH_AREA';
export const SET_VIEWING_AREA = 'SET_VIEWING_AREA';
export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';
export const SET_MODAL_CONTENT = 'SET_MODAL_CONTENT';
export const SET_ACTIVE_MOBILE_PANEL = 'SET_ACTIVE_MOBILE_PANEL';

export const fetchListing = (id, callback = () => {}) => {
  const request = axios.get(`${ROOT_URL}/properties/${id}`, AUTH_HEADER);

  return dispatch => request.then(// Success callback
    ({ data }) => {
      callback();

      // Dispatch the action to the reducer
      dispatch({
        type: FETCH_LISTING,
        payload: data,
      });
    },
    // Error callback
    (error) => {
      alert(`The request could not be completed due to a system error: ${error}`);
    }
  );
};


export const fetchListings = (searchBounds, callback = () => {}) => {
  const request = axios.get(`${ROOT_URL}/properties${searchBounds}`, AUTH_HEADER);


  return (dispatch) => {
    // Dispatch the action to the reducer
    dispatch({
      type: FETCH_LISTINGS,
    });

    return request.then(// Success callback
      ({ data }) => {
        callback();

        // Dispatch the action to the reducer
        dispatch({
          type: FETCH_LISTINGS_COMPLETE,
          payload: data,
        });
      },
      // Error callback
      (error) => {
        alert(`The request could not be completed due to a system error: ${error}`);
      }
    );
  };
};

export const selectSearchArea = ({ points, shape }) => ({
  type: SELECT_SEARCH_AREA,
  points,
  shape,
});

export const resetSearchArea = () => ({
  type: RESET_SEARCH_AREA,
  points: [],
  shape: {},
});

export const setViewingArea = points => ({
  type: SET_VIEWING_AREA,
  points,
});

export const showModal = content => ({
  type: SHOW_MODAL,
  content,
});

export const hideModal = () => ({
  type: HIDE_MODAL,
});

export const setModalContent = content => ({
  type: SET_MODAL_CONTENT,
  content,
});

export const setActiveMobilePanel = panelName => ({
  type: SET_ACTIVE_MOBILE_PANEL,
  panelName,
});
