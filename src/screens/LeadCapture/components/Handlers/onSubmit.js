// import CustomAlert from '../../../../common/components/BottomPopover/CustomAlert';
import { globalConstants } from '../../../../common/constants/globalConstants';
import { soupConfig } from '../../../../common/constants/soupConstants';
import { QuerySoupById } from '../../../../services/QueryRequests/QuerySoupById';
import {
  saveRecordOffline,
  updateRecordOffline,
} from '../../../../store/soups/LeadSoup';
import leadSyncUp from '../../../../store/soups/LeadSoup/LeadSyncUp';
import { GetBrManagerId } from './GetBranchManagerId';
import { GetChannelId, GetRmBranchName, GetRmIdByRmName } from './GetChannelId';
import Toast from 'react-native-toast-message';
import { GetProductId } from './GetProductId';

export const OnSubmitLead = async (
  data,
  setId,
  id,
  teamHeirarchyByUserId,
  dsaBrJnData,
  empRole,
  isOnline,
  setPostData,
  teamHeirarchyMasterData,
  productMappingData,
  setCurrentPosition,
  currentPosition,
) => {
  try {
    // RM Data Mapping
    if (empRole === globalConstants.RoleNames.RM) {
      data.Channel_Name__c = await GetChannelId(dsaBrJnData, data.Channel_Name);

      data.Bank_Branch__c = teamHeirarchyByUserId
        ? teamHeirarchyByUserId?.EmpBrch__c
        : '';
    }

    // UGA Data Mapping and Lead Assignment
    if (empRole === globalConstants.RoleNames.UGA) {
      data.RM_SM_Name__c = GetRmIdByRmName(
        teamHeirarchyMasterData,
        data.RM_Name
      );
      data.Br_Manager_Br_Name = GetRmBranchName(
        teamHeirarchyMasterData,
        data.RM_SM_Name__c
      );
      // assign Lead to selected Rm When UGA is logged in
      data.OwnerId = data.RM_SM_Name__c;
    }

    // Common Data Mapping

    data.ProductLookup__c = GetProductId(
      productMappingData,
      data.ProductLookup
    );
    data.Branch_Manager__c = GetBrManagerId(
      teamHeirarchyMasterData,
      data.Br_Manager_Br_Name
    );

    // Lead Assignment when RM Logs in

    if (empRole === globalConstants.RoleNames.RM) {
      if (data.LeadSource === 'Direct-RM') {
        data.RM_SM_Name__c = teamHeirarchyByUserId
          ? teamHeirarchyByUserId?.Employee__c
          : '';
        data.OwnerId = teamHeirarchyByUserId
          ? teamHeirarchyByUserId?.Employee__c
          : '';
      } else {
        // check if selected Bank_branch__c(Brnach Name) exist in Logged in RM Juridiction
        const isValidJurisdiction =
          teamHeirarchyByUserId &&
          teamHeirarchyByUserId?.EmpBrch__r.Name === data.Br_Manager_Br_Name
            ? true
            : false;
        if (isValidJurisdiction) {
          data.RM_SM_Name__c = teamHeirarchyByUserId
            ? teamHeirarchyByUserId?.Employee__c
            : '';
          data.OwnerId = teamHeirarchyByUserId
            ? teamHeirarchyByUserId?.Employee__c
            : '';
        } else {
          data.OwnerId = data.Branch_Manager__c;
        }
      }
    }

    // Lead Assignment When DSA Logs in

    if (empRole === globalConstants.RoleNames.DSA) {
      data.OwnerId = data.Branch_Manager__c;
    }

    // Saving the Data locally

    let res =
      id.length > 0
        ? await updateRecordOffline(
            data,
            soupConfig.lead.objectName,
            soupConfig.lead.soupName,
            soupConfig.lead.SMARTSTORE_CHANGED
          )
        : await saveRecordOffline(
            data,
            soupConfig.lead.objectName,
            soupConfig.lead.soupName,
            soupConfig.lead.SMARTSTORE_CHANGED
          );

    // syncing data if in network zone
    if (isOnline) {
      await leadSyncUp();
    }

    if (res.success) {
      // console.log('ID in submit Fxn', res);
      // ----------------------
      if (id.length < 1 || id.includes('local')) {
        let offlineLead = await QuerySoupById(
          soupConfig.lead.soupName,
          'localId',
          res.success && res?.res[0].Id,
          soupConfig.lead.pageSize
        );
        let updatedLeadData =
          offlineLead?.length > 0 ? { ...offlineLead[0] } : {};
        res.success && setId(updatedLeadData?.Id);
        res.success && setPostData(updatedLeadData);

        console.log('updatedLeadData------------>', updatedLeadData);

        if (
          updatedLeadData &&
          updatedLeadData.hasOwnProperty('__last_error__')
        ) {
          Toast.show({
            type: 'error',
            text1: 'Failed to Create/Update Lead',
            position: 'top',
          });
        }
      } else {
        setId(res?.res[0].Id);
        setPostData(res?.res[0]);
      }

      !id &&
        Toast.show({
          type: 'success',
          text1: 'Lead created successfully',
          position: 'top',
        });
      id &&
        Toast.show({
          type: 'success',
          text1: 'Lead updated successfully',
          position: 'top',
        });
        setCurrentPosition((prev) => prev + 1);
    } else {
      // setAddLoading(false);
      setCurrentPosition(currentPosition);
    }
  } catch (error) {
    console.log('Error OnSubmitLead ', error);
    !id &&
      Toast.show({
        type: 'error',
        text1: 'Failed to Create Lead',
        position: 'top',
      });
    id &&
      Toast.show({
        type: 'error',
        text1: 'Failed to Update Lead',
        position: 'top',
      });
  }
};
// let userPincodeExist =
//   userLocation &&
//   pincodeMasterData.find((pin) => {
//     pin.City__c === userLocation?.Location__c &&
//       pin?.PIN__c === data?.Pincode__c;
//   });

// // let  pincodeExist = userPincodes?.find((pin))
// if (!userPincodeExist) {
//   let pin = pincodeMasterData.find((p) => p.PIN__c === data?.Pincode__c);
//   if (!pin) {
//     alert(`Please enter a Servicable Pincode`);
//   } else {
//     alert(
//       `Pincode of ${pin?.State__c} state entered. Kindly check the Pincode entered`
//     );
//   }
// }
