import { combineReducers, configureStore } from '@reduxjs/toolkit';
import leadReducer from './slices/LeadSlice';
import credentialReducer from './slices/CredentialsSlice';
import teamHeirarchyReducer from './slices/TeamHeirarchySlice';
import leadMetaDataReducer from './slices/LeadMetaData';
import masterDataReducer from './slices/MasterData';
import thunk from 'redux-thunk';

const reducer = combineReducers({
  leads: leadReducer,
  credentials: credentialReducer,
  teamHeirarchy: teamHeirarchyReducer,
  leadMetadata: leadMetaDataReducer,
  masterData: masterDataReducer,
});

const store = configureStore({
  reducer,
  middleware: [thunk],
});

export default store;
