import { combineReducers, configureStore } from "@reduxjs/toolkit";
import leadReducer from "./slices/LeadSlice";
import credentialReducer from "./slices/CredentialsSlice";
import teamHeirarchyReducer from "./slices/TeamHeirarchySlice";
import leadMetaDataReducer from "./slices/LeadMetaData";
import masterDataReducer from "./slices/MasterData";
import meetingDataReducer from "./slices/MeetingDataSlice";
import thunk from "redux-thunk";
import pdReducer from "./slices/PdListSlice";
const reducer = combineReducers({
  pd: pdReducer,
  leads: leadReducer,
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
