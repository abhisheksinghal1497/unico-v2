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
import { GetChannelId } from './GetChannelId';
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
  productMappingData
) => {
  try {
    if (empRole === globalConstants.RoleNames.RM) {
      data.RM_SM_Name__c = teamHeirarchyByUserId
        ? teamHeirarchyByUserId?.Employee__r.Id
        : '';
      data.Channel_Name__c = await GetChannelId(dsaBrJnData, data.Channel_Name);

      data.Bank_Branch__c = teamHeirarchyByUserId
        ? teamHeirarchyByUserId?.EmpBrch__c
        : '';
      data.Branch_Manager__c ===
        GetBrManagerId(teamHeirarchyMasterData, data.Br_Manager_Br_Name);
      data.ProductLookup__c = GetProductId(
        productMappingData,
        data.ProductLookup
      );
    }

    console.log('On Submit Data', data);

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
      }
      // -----------------------
      else {
        setId(res?.res[0].Id);
        setPostData(res?.res[0]);
      }
      //   setAddLoading(false);

      !id &&
        Toast.show({
          type: 'success',
          text1: 'Lead created successfully',
          position: 'top',
        });
      //   setAddLoading(false);

      //   //  setCurrentPosition((prev) => prev + 1);
    } else {
      // setAddLoading(false);
      //  setCurrentPosition(currentPosition);
    }
  } catch (error) {
    console.log('Error OnSubmitLead ', error);
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
