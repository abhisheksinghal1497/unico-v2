import { createSlice } from '@reduxjs/toolkit';

const initialTeamHeirarchyState = {
  teamHeirarchyById: {
    teamHeirarchyByUserId: {},
    hasError: false,
    loading: false,
  },
  teamHeirarchyMaster: {
    teamHeirarchyMasterData: [],
    hasError: false,
    loading: false,
  },
};

const teamHeirarchySlice = createSlice({
  name: 'teamheirarchy',
  initialState: initialTeamHeirarchyState,
  reducers: {
    getTeamHeirarchyByUserId: (state, { payload }) => {
      state.teamHeirarchyById.teamHeirarchyByUserId =
        payload.teamHeirarchyById.teamHeirarchyByUserId;
      state.teamHeirarchyById.hasError = payload.teamHeirarchyById.hasError;
      state.teamHeirarchyById.loading = false;
    },
    getTeamHeirarchyMaster: (state, { payload }) => {
      state.teamHeirarchyMaster.teamHeirarchyMasterData =
        payload.teamHeirarchyMaster.teamHeirarchyMasterData;
      state.teamHeirarchyMaster.hasError = payload.teamHeirarchyMaster.hasError;
      state.teamHeirarchyMaster.loading = false;
    },
  },
});

export const teamHeirarchyAction = teamHeirarchySlice.actions;
export default teamHeirarchySlice.reducer;
