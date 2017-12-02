import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import ListingsReducer from './ListingsReducer';
import MapReducer from './MapReducer';
import SelectedSearchAreaReducer from './SelectedSearchAreaReducer';
import ModalReducer from './ModalReducer';

const rootReducer = combineReducers({
  listings: ListingsReducer,
  // listingsFetchStatus: makeFlagReducer('LOADING', 'LOADED', ['FETCH_LISTINGS'], ['FETCH_LISTINGS_COMPLETE'], 'IDLE'),
  map: MapReducer,
  selectedSearchArea: SelectedSearchAreaReducer,
  form: formReducer,
  modal: ModalReducer,
});

export default rootReducer;
