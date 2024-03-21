import { oauth } from 'react-native-force';
import { soupConfig } from '../../../common/constants/soupConstants';
import { QuerySoup } from '../../../services/QuerySoup';
import { masterDataAction } from '../slices/MasterData';
import { getAuthCredentials } from '../../../services/GetRequestService/GetAuthCredentials';

export const getDsaBrJn = () => {
  return async (dispatch) => {
    try {
      const dsaBrJn = await QuerySoup(
        soupConfig.dsaBrJn.soupName,
        soupConfig.dsaBrJn.queryPath,
        soupConfig.dsaBrJn.pageSize
      );
      let userDetails = await getAuthCredentials();
      let dsaBrJnDataByUserId = dsaBrJn?.filter(
        (dsaBr) =>
          dsaBr?.RMUsr__c === userDetails?.userId ||
          dsaBr?.DSAUGA__c === userDetails?.userId
      );

      // console.log(
      //   'Dsa Branch Junction',
      //   dsaBrJn,
      //   userDetails,
      //   dsaBrJnDataByUserId
      // );
      dispatch(
        masterDataAction.getDsaBrJnData({
          dsaBrJn: {
            dsaBrJnData: dsaBrJnDataByUserId,
            hasError: false,
          },
        })
      );
    } catch (error) {
      dispatch(
        masterDataAction.getDsaBrJnData({
          dsaBrJn: {
            dsaBrJnData: [],
            hasError: true,
          },
        })
      );
      console.log('getDsaBrJn Error', error);
    }
  };
};
export const getDsaBrJnMaster = () => {
  return async (dispatch) => {
    try {
      const dsaBrJn = await QuerySoup(
        soupConfig.dsaBrJn.soupName,
        soupConfig.dsaBrJn.queryPath,
        soupConfig.dsaBrJn.pageSize
      );
      // console.log('Dsa Branch Junction', dsaBrJn);
      dispatch(
        masterDataAction.getDsaBrJnMasterData({
          dsaBrJnMaster: {
            dsaBrJnMasterData: dsaBrJn,
            hasError: false,
          },
        })
      );
    } catch (error) {
      dispatch(
        masterDataAction.getDsaBrJnMasterData({
          dsaBrJnMaster: {
            dsaBrJnMasterData: [],
            hasError: true,
          },
        })
      );
      console.log('getDsaBrJn Error', error);
    }
  };
};

export const getLocationMaster = () => {
  return async (dispatch) => {
    try {
      const locationMaster = await QuerySoup(
        soupConfig.locationMaster.soupName,
        soupConfig.locationMaster.queryPath,
        soupConfig.locationMaster.pageSize
      );

      // console.log('Location', locationMaster);

      dispatch(
        masterDataAction.getLocationMaster({
          locationMaster: {
            locationMasterData: locationMaster,
            hasError: false,
          },
        })
      );
    } catch (error) {
      dispatch(
        masterDataAction.getDsaBrJnData({
          dsaBrJn: {
            locationMasterData: [],
            hasError: true,
          },
        })
      );
      console.log('getLocationMaster Error', error);
    }
  };
};

export const getProductMapping = () => {
  return async (dispatch) => {
    try {
      const productMapping = await QuerySoup(
        soupConfig.productMapping.soupName,
        soupConfig.productMapping.queryPath,
        soupConfig.productMapping.pageSize
      );

      dispatch(
        masterDataAction.getProductMapping({
          productMapping: {
            productMappingData: productMapping,
            hasError: false,
          },
        })
      );
      // console.log("product Mapping------>", productMapping);
    } catch (error) {
      dispatch(
        masterDataAction.getProductMapping({
          productMapping: {
            productMappingData: [],
            hasError: true,
          },
        })
      );
      console.log('getProductMapping Error', error);
    }
  };
};
export const getCustomerMaster = () => {
  return async (dispatch) => {
    try {
      const customerMaster = await QuerySoup(
        soupConfig.customerMaster.soupName,
        soupConfig.customerMaster.queryPath,
        soupConfig.customerMaster.pageSize
      );

      dispatch(
        masterDataAction.getCustomerMaster({
          customerMaster: {
            customerMasterData: customerMaster,
            hasError: false,
          },
        })
      );
      // console.log("product Mapping------>", productMapping);
    } catch (error) {
      dispatch(
        masterDataAction.getCustomerMaster({
          productMapping: {
            customerMasterData: [],
            hasError: true,
          },
        })
      );
      console.log('getProductMapping Error', error);
    }
  };
};
export const getBankBranchMaster = () => {
  return async (dispatch) => {
    try {
      const bankBranchMaster = await QuerySoup(
        soupConfig.bankBranchMaster.soupName,
        soupConfig.bankBranchMaster.queryPath,
        soupConfig.bankBranchMaster.pageSize
      );

      dispatch(
        masterDataAction.getBankBranchMaster({
          bankBranchMaster: {
            bankBranchMasterData: bankBranchMaster,
            hasError: false,
          },
        })
      );
      // console.log("product Mapping------>", productMapping);
    } catch (error) {
      dispatch(
        masterDataAction.getBankBranchMaster({
          bankBranchMaster: {
            bankBranchMasterData: [],
            hasError: true,
          },
        })
      );
      console.log('getProductMapping Error', error);
    }
  };
};
export const getLocationBrJnMaster = () => {
  return async (dispatch) => {
    try {
      const locationBrJnMaster = await QuerySoup(
        soupConfig.locationBrJnMaster.soupName,
        soupConfig.locationBrJnMaster.queryPath,
        soupConfig.locationBrJnMaster.pageSize
      );

      dispatch(
        masterDataAction.getLocationBrJnMaster({
          locationBrJnMaster: {
            locationBrJnMasterData: locationBrJnMaster,
            hasError: false,
          },
        })
      );
      // console.log("product Mapping------>", productMapping);
    } catch (error) {
      dispatch(
        masterDataAction.getLocationBrJnMaster({
          locationBrJnMaster: {
            locationBrJnMasterData: [],
            hasError: true,
          },
        })
      );
      console.log('getProductMapping Error', error);
    }
  };
};
export const getPincodeMaster = () => {
  return async (dispatch) => {
    try {
      const pincodeMaster = await QuerySoup(
        soupConfig.pincodeMaster.soupName,
        soupConfig.pincodeMaster.queryPath,
        soupConfig.pincodeMaster.pageSize
      );

      // console.log('pincode Master', pincodeMaster);

      dispatch(
        masterDataAction.getPincodeMaster({
          pincodeMaster: {
            pincodeMasterData: pincodeMaster,
            hasError: false,
          },
        })
      );
      // console.log("product Mapping------>", productMapping);
    } catch (error) {
      dispatch(
        masterDataAction.getPincodeMaster({
          pincodeMaster: {
            pincodeMasterData: [],
            hasError: true,
          },
        })
      );
      console.log('getProductMapping Error', error);
    }
  };
};
export const getUserInfoMaster = () => {
  return async (dispatch) => {
    try {
      const userInfoMaster = await QuerySoup(
        soupConfig.userInfo.soupName,
        soupConfig.userInfo.queryPath,
        soupConfig.userInfo.pageSize
      );

      // console.log('pincode Master', pincodeMaster);

      dispatch(
        masterDataAction.getUserInfoMaster({
          userInfoMaster: {
            userInfoMasterData: userInfoMaster,
            hasError: false,
          },
        })
      );
      // console.log("product Mapping------>", productMapping);
    } catch (error) {
      dispatch(
        masterDataAction.getUserInfoMaster({
          userInfoMaster: {
            userInfoMasterData: [],
            hasError: true,
          },
        })
      );
      console.log('getProductMapping Error', error);
    }
  };
};
