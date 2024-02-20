import { createSlice } from '@reduxjs/toolkit';

const initialMasterDataState = {
  dsaBrJn: {
    dsaBrJnData: [],
    loading: false,
    hasError: false,
  },
  locationMaster: {
    locationMasterData: [],
    hasError: false,
    loading: false,
  },
  productMapping: {
    productMappingData: [],
    hasError: false,
    loading: false,
  },
  customerMaster: {
    customerMasterData: [],
    hasError: false,
    loading: false,
  },
  bankBranchMaster: {
    bankBranchMasterData: [],
    hasError: false,
    loading: false,
  },
  locationBrJnMaster: {
    locationBrJnMasterData: [],
    hasError: false,
    loading: false,
  },
  pincodeMaster: {
    pincodeMasterData: [],
    hasError: false,
    loading: false,
  },
  userInfoMaster: {
    userInfoMasterData: [],
    hasError: false,
    loading: false,
  },
};

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState: initialMasterDataState,
  reducers: {
    getDsaBrJnData: (state, { payload }) => {
      state.dsaBrJn.loading = false;
      state.dsaBrJn.dsaBrJnData = payload.dsaBrJn.dsaBrJnData;
      state.dsaBrJn.hasError = payload.dsaBrJn.hasError;
    },
    getLocationMaster: (state, { payload }) => {
      state.locationMaster.locationMasterData =
        payload.locationMaster.locationMasterData;
      state.locationMaster.hasError = payload.locationMaster.hasError;
      state.locationMaster.loading = false;
    },

    getProductMapping: (state, { payload }) => {
      state.productMapping.productMappingData =
        payload.productMapping.productMappingData;
      state.productMapping.hasError = payload.productMapping.hasError;
      state.productMapping.loading = false;
    },
    getCustomerMaster: (state, { payload }) => {
      state.customerMaster.customerMasterData =
        payload.customerMaster.customerMasterData;
      state.customerMaster.hasError = payload.customerMaster.hasError;
      state.customerMaster.loading = false;
    },
    getBankBranchMaster: (state, { payload }) => {
      state.bankBranchMaster.bankBranchMasterData =
        payload.bankBranchMaster.bankBranchMasterData;
      state.bankBranchMaster.hasError = payload.bankBranchMaster.hasError;
      state.bankBranchMaster.loading = false;
    },
    getLocationBrJnMaster: (state, { payload }) => {
      state.locationBrJnMaster.locationBrJnMasterData =
        payload.locationBrJnMaster.locationBrJnMasterData;
      state.locationBrJnMaster.hasError = payload.locationBrJnMaster.hasError;
      state.locationBrJnMaster.loading = false;
    },
    getPincodeMaster: (state, { payload }) => {
      state.pincodeMaster.pincodeMasterData =
        payload.pincodeMaster.pincodeMasterData;
      state.pincodeMaster.hasError = payload.pincodeMaster.hasError;
      state.pincodeMaster.loading = false;
    },
    getUserInfoMaster: (state, { payload }) => {
      state.userInfoMaster.userInfoMasterData =
        payload.userInfoMaster.userInfoMasterData;
      state.userInfoMaster.hasError = payload.userInfoMaster.hasError;
      state.userInfoMaster.loading = false;
    },
  },
});

export const masterDataAction = masterDataSlice.actions;
export default masterDataSlice.reducer;
