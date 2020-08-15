import { combineReducers } from 'redux';
import app from './app/reducers';

const createRootReducer = () =>
  combineReducers({
    app,
  });

export default createRootReducer;
