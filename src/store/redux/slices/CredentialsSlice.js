import { createSlice } from '@reduxjs/toolkit';

const initialCredentialsState = {
  credentials: {},
  loading: false,
  hasError: false,
};

const credentialSlice = createSlice({
  name: 'credentials',
  initialState: initialCredentialsState,
  reducers: {
    getCredentials: (state, { payload }) => {
      state.loading = false;
      state.credentials = payload.credentials;
      state.hasError = payload.hasError;
    },
  },
});

export const credentialActions = credentialSlice.actions;
export default credentialSlice.reducer;
