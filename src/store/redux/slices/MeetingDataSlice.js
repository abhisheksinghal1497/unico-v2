import { createSlice } from '@reduxjs/toolkit';

const initialMeetingData = {
  meetingdata: [],
  hasError: false,
  loading: true,
};

const meetingDataSlice = createSlice({
  name: 'meetingdata',
  initialState: initialMeetingData,
  reducers: {
    getMeetingData: (state, { payload }) => {
      state.meetingdata = payload.meetingdata;
      state.hasError = payload.hasError;
      state.loading = payload.loading;
    },
  },
});

export const meetingdataActions = meetingDataSlice.actions;

export default meetingDataSlice.reducer;
