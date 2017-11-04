import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import ListingsReducer from './ListingsReducer';
import MapReducer from './MapReducer';
import SelectedSearchAreaReducer from './SelectedSearchAreaReducer';
import SearchParametersReducer from './SearchParametersReducer';

const rootReducer = combineReducers({
  listings: ListingsReducer,
  map: MapReducer,
  selectedSearchArea: SelectedSearchAreaReducer,
  searchParameters: SearchParametersReducer,
  form: formReducer,
});

export default rootReducer;
