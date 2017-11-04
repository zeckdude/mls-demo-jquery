import axios from 'axios';
import { ROOT_URL, AUTH_HEADER } from '../config/api/simplyrets';

export const FETCH_LISTINGS = 'FETCH_LISTINGS';
export const FETCH_LISTING = 'FETCH_LISTING';
export const SELECT_SEARCH_AREA = 'SELECT_SEARCH_AREA';
export const RESET_SEARCH_AREA = 'RESET_SEARCH_AREA';
export const SET_VIEWING_AREA = 'SET_VIEWING_AREA';
export const SET_SEARCH_PARAMETERS = 'SET_SEARCH_PARAMETERS';

// export const fetchListings = () => {
//   const request = axios.get(`${ROOT_URL}/properties`);
//
//   // When returning only an object, the redux-promise middleware will wait for the AJAX request response and will then get the data out of the response to send to the reducer
//   return {
//     type: FETCH_POSTS,
//     payload: request
//   };
// };

// export const fetchPost = id => {
//   const request = axios.get(`${ROOT_URL}/posts/${id}${API_KEY}`);
//
//   return {
//     type: FETCH_POST,
//     payload: request
//   };
// };


export const fetchListings = (searchBounds, callback = () => {}) => {
  const request = axios.get(`${ROOT_URL}/properties${searchBounds}`, AUTH_HEADER);

  return dispatch =>
    request.then(// Success callback
      ({ data }) => {
        callback();

        // Dispatch the action to the reducer
        dispatch({
          type: FETCH_LISTINGS,
          payload: data,
        });
      },
      // Error callback
      (error) => {
        alert(`The request could not be completed due to a system error: ${error}`);
      }
    );
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

export const setSearchParameters = properties => ({
  type: SET_SEARCH_PARAMETERS,
  properties,
});
