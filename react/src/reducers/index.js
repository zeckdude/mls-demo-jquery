import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import ListingsReducer from './ListingsReducer';
import MapReducer from './MapReducer';
import SelectedSearchAreaReducer from './SelectedSearchAreaReducer';
import ModalReducer from './ModalReducer';

const rootReducer = combineReducers({
  listings: ListingsReducer,
  map: MapReducer,
  selectedSearchArea: SelectedSearchAreaReducer,
  form: formReducer,
  modal: ModalReducer,
});

export default rootReducer;
