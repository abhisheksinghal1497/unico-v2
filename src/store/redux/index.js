import { combineReducers, configureStore } from '@reduxjs/toolkit';
import leadReducer from './slices/LeadSlice';
import credentialReducer from './slices/CredentialsSlice';
import teamHeirarchyReducer from './slices/TeamHeirarchySlice';
import leadMetaDataReducer from './slices/LeadMetaData';
import masterDataReducer from './slices/MasterData';
import meetingDataReducer from './slices/MeetingDataSlice';
import pdReducer from "./slices/PdListSlice";
import thunk from 'redux-thunk';

const reducer = combineReducers({
  leads: leadReducer,
  pd: pdReducer,
  credentials: credentialReducer,
  teamHeirarchy: teamHeirarchyReducer,
  leadMetadata: leadMetaDataReducer,
  masterData: masterDataReducer,
  meetingdata: meetingDataReducer,
});

const store = configureStore({
  reducer,
  middleware: [thunk],
});

export default store;
