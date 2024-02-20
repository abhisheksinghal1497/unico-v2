import CustomAlert from '../../../../common/components/BottomPopover/CustomAlert';
import { globalConstants } from '../../../../common/constants/globalConstants';
import { soupConfig } from '../../../../common/constants/soupConstants';
import { QuerySoupById } from '../../../../services/QueryRequests/QuerySoupById';
import {
  saveRecordOffline,
  updateRecordOffline,
} from '../../../../store/soups/LeadSoup';
import leadSyncUp from '../../../../store/soups/LeadSoup/LeadSyncUp';
import { GetChannelId } from './GetChannelId';
import Toast from 'react-native-toast-message';

export const OnSubmitLead = async (
  data,
  setId,
  id,
  teamHeirarchyByUserId,
  dsaBrJnData,
  empRole,
  isOnline,
  setPostData,
  userBranch
) => {
  try {
    if (empRole === globalConstants.RoleNames.DSA) {
      data.LeadSource = 'DSA';
    }

    if (empRole === globalConstants.RoleNames.RM) {
      data.RM_SM_Name__c = teamHeirarchyByUserId
        ? teamHeirarchyByUserId?.Employee__r.Id
        : '';
      data.Channel_Name__c = await GetChannelId(
        dsaBrJnData,
        data.Channel_Name__c
      );

      data.Bank_Branch__c = userBranch;
    }

    console.log('On Submit Data', data);

    // let res =
    //   id.length > 0
    //     ? await updateRecordOffline(
    //         data,
    //         soupConfig.lead.objectName,
    //         soupConfig.lead.soupName,
    //         soupConfig.lead.SMARTSTORE_CHANGED
    //       )
    //     : await saveRecordOffline(
    //         data,
    //         soupConfig.lead.objectName,
    //         soupConfig.lead.soupName,
    //         soupConfig.lead.SMARTSTORE_CHANGED
    //       );

    // if (isOnline) {
    //   await leadSyncUp();
    // }

    // if (res.success) {
    //   // console.log('ID in submit Fxn', res);
    //   // ----------------------
    //   if (id.length < 1 || id.includes('local')) {
    //     let offlineLead = await QuerySoupById(
    //       soupConfig.lead.soupName,
    //       'localId',
    //       res.success && res?.res[0].Id,
    //       soupConfig.lead.pageSize
    //     );
    //     let updatedLeadData =
    //       offlineLead?.length > 0 ? { ...offlineLead[0] } : {};
    //     res.success && setId(updatedLeadData?.Id);
    //     res.success && setPostData(updatedLeadData);

    //     //  console.log('updatedLeadData------------>', updatedLeadData);
    //   }
    //   // -----------------------
    //   else {
    //     setId(res?.res[0].Id);
    //     setPostData(res?.res[0]);
    //   }
    //   setAddLoading(false);

    //   !id &&
    Toast.show({
      type: 'success',
      text1: 'Lead created successfully',
      position: 'top',
    });
    //   setAddLoading(false);

    //   //  setCurrentPosition((prev) => prev + 1);
    // } else {
    //   setAddLoading(false);

    //   //  setCurrentPosition(currentPosition);
    // }
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
