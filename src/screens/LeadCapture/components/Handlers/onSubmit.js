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
import {
  GetBrIdByBrName,
  GetChannelId,
  GetRmBranchName,
  GetRmIdByRmName,
} from './GetChannelId';
import Toast from 'react-native-toast-message';
import { GetProductId } from './GetProductId';
import { oauth } from 'react-native-force';

export const OnSubmitLead = async (
  data,
  setId,
  id,
  teamHeirarchyByUserId,
  dsaBrJnData,
  empRole,
  isOnline,
  setPostData,
  setCurrentPosition,
  currentPosition,
  teamHeirarchyMasterData,
  productMappingData,
  pincodeMasterData,
  setIsMobileNumberChanged
) => {
  try {
    // RM Data Mapping And Lead assignment
    if (empRole === globalConstants.RoleNames.RM) {
      if (data.MobilePhoneOtp && data.MobilePhoneOtp !== data.MobilePhone) {
        setIsMobileNumberChanged(true);
      }
      data.MobilePhoneOtp = data.MobilePhone;
      data.Requested_loan_amount__c =
        data?.Requested_loan_amount__c && data?.Requested_loan_amount__c != 0
          ? data?.Requested_loan_amount__c
          : null;
      data.Requested_tenure_in_Months__c =
        data?.Requested_tenure_in_Months__c &&
        data?.Requested_tenure_in_Months__c != 0
          ? data?.Requested_tenure_in_Months__c
          : null;
      data.Channel_Name__c = await GetChannelId(dsaBrJnData, data.Channel_Name);
      data.ProductLookup__c = GetProductId(
        productMappingData,
        data.ProductLookup
      );
      data.Bank_Branch__c = GetBrIdByBrName(
        pincodeMasterData,
        data.Br_Manager_Br_Name
      );

      data.Branch_Manager__c = GetBrManagerId(
        teamHeirarchyMasterData,
        data.Br_Manager_Br_Name
      );
      // Lead Assignment when RM Logs in
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
      data.Bank_Branch__c = GetBrIdByBrName(
        pincodeMasterData,
        data.Br_Manager_Br_Name
      );
      data.Branch_Manager__c = GetBrManagerId(
        teamHeirarchyMasterData,
        data.Br_Manager_Br_Name
      );
      // assign Lead to selected Rm When UGA is logged inm
      data.OwnerId = data.RM_SM_Name__c;
    }

    // Lead Assignment and data mapping When DSA Logs in

    if (empRole === globalConstants.RoleNames.DSA) {
      data.Branch_Manager__c = GetBrManagerId(
        teamHeirarchyMasterData,
        data.Br_Manager_Br_Name
      );
      data.Bank_Branch__c = GetBrIdByBrName(
        pincodeMasterData,
        data.Br_Manager_Br_Name
      );
      // assigning lead to branch manager
      data.OwnerId = data.Branch_Manager__c;
    }

    // console.log('On submit Data', data);

    // Saving the Data locally

    // console.log('Data', data);

    if (!data.OwnerId) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text1: 'Failed to Create Lead',
        position: 'top',
      });
      return;
    }

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
        console.log('updatedResData------------>', res?.res[0]);
      }

      // Write Logic for showing otp verification Screen
      // OTP Verification screen can be shown if lead is assigned to RM that means OWNERID and Employee Id are same also if network is there then this screen should be visible otherwise send a toast msg that network is not there
      oauth.getAuthCredentials((cred) => {
        //   console.log('Entered', id);
        if (data?.OwnerId === cred?.userId) {
          !id &&
            Toast.show({
              type: 'success',
              text1: 'Lead created successfully',
              position: 'top',
            });
          setCurrentPosition((prev) => prev + 1);
          return;
        } else {
          !id &&
            Toast.show({
              type: 'success',
              text1:
                'Lead created successfully  And Assigned to Branch Manager',
              position: 'top',
            });
        }

        return;
      });
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
