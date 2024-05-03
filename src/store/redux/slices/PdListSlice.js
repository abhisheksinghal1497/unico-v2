import { createSlice } from "@reduxjs/toolkit";

const initialPdState = {
  pdList: {
    pd: [],
    loading: false,
    hasError: false,
  },

  singlePd: {
    pd: [],
    loading: false,
    hasError: false,
  },
};

const pdSlice = createSlice({
  name: "pd",
  initialState: initialPdState,
  reducers: {
    getPdList: (state, { payload }) => {
      state.pdList.loading = payload.pdList.loading;
      state.pdList.pd = payload.pdList.pd;
      state.pdList.hasError = payload.hasError;
    },

    getPdById: (state, { payload }) => {
      state.singlePd.pd = payload.singlePd.pd;
      state.singlePd.loading = false;
      state.singlePd.hasError = payload.singlePd.hasError;
    },
  },
});

export const pdActions = pdSlice.actions;
export default pdSlice.reducer;
