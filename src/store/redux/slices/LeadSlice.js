import { createSlice } from '@reduxjs/toolkit';

const initialLeadState = {
  lead: {
    leads: [],
    loading: false,
    hasError: false,
  },
  leadListViews: {
    listViews: [],
    hasError: false,
    listViewLoading: false,
  },
  singleLead: {
    lead: [],
    loading: false,
    hasError: false,
  },
};

const leadSlice = createSlice({
  name: 'lead',
  initialState: initialLeadState,
  reducers: {
    getLeads: (state, { payload }) => {
      state.lead.loading = payload.lead.loading;
      state.lead.leads = payload.lead.leads;
      state.lead.hasError = payload.hasError;
    },
    getLeadListViews: (state, { payload }) => {
      state.leadListViews.listViews = payload.leadListViews.listViews;
      state.leadListViews.listViewLoading =
        payload.leadListViews.listViewLoading;
      state.leadListViews.hasError = payload.leadListViews.hasError;
    },
    getLeadById: (state, { payload }) => {
      state.singleLead.lead = payload.singleLead.lead;
      state.singleLead.loading = false;
      state.singleLead.hasError = payload.singleLead.hasError;
    },
  },
});

export const leadActions = leadSlice.actions;
export default leadSlice.reducer;
