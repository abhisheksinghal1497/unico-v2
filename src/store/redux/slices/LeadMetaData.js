import { createSlice } from '@reduxjs/toolkit';

const initialLeadMetaData = {
  leadMetadata: [],
  hasError: false,
  loading: false,
};

const metaDataSlice = createSlice({
  name: 'leadMetadata',
  initialState: initialLeadMetaData,
  reducers: {
    getLeadMetaData: (state, { payload }) => {
      state.leadMetadata = payload.leadMetadata;
      state.hasError = payload.hasError;
      state.loading = false;
    },
  },
});

export const leadMetadataActions = metaDataSlice.actions;

export default metaDataSlice.reducer;
