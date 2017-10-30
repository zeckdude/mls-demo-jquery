import { combineReducers } from 'redux';
import ListingsReducer from './ListingsReducer';
import SelectedSearchAreaReducer from './SelectedSearchAreaReducer';

const rootReducer = combineReducers({
  listings: ListingsReducer,
  selectedSearchArea: SelectedSearchAreaReducer,
});

export default rootReducer;
