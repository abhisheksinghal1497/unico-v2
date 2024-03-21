// import CustomAlert from '../../../../common/components/BottomPopover/CustomAlert';
import { soupConfig } from '../../../../common/constants/soupConstants';
import { QuerySoupById } from '../../../../services/QueryRequests/QuerySoupById';
import { updateRecordOffline } from '../../../../store/soups/LeadSoup';
import leadSyncUp from '../../../../store/soups/LeadSoup/LeadSyncUp';
import Toast from 'react-native-toast-message';

export const onSubmitOtp = async (data, setPostData) => {
  try {
    // console.log('On submit OTP Data', data);

    // Saving the Data locally

    let res = await updateRecordOffline(
      data,
      soupConfig.lead.objectName,
      soupConfig.lead.soupName,
      soupConfig.lead.SMARTSTORE_CHANGED
    );

    // syncing data if in network zone
    // if (isOnline) {
    await leadSyncUp();
    // }

    if (res.success) {
      // console.log('ID in submit Fxn', res);
      let offlineLead = await QuerySoupById(
        soupConfig.lead.soupName,
        soupConfig.lead.queryPath,
        res?.res[0].Id,
        soupConfig.lead.pageSize
      );
      updatedLeadData = offlineLead?.length > 0 ? { ...offlineLead[0] } : {};
      if (updatedLeadData && updatedLeadData.hasOwnProperty('__last_error__')) {
        Toast.show({
          type: 'error',
          text1: 'Something Went Wrong',
          position: 'top',
        });
        return false;
      }
      setPostData(res?.res[0]);
      return true;
      //   !id &&
      //     Toast.show({
      //       type: 'success',
      //       text1: 'Lead created successfully',
      //       position: 'top',
      //     });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Something Went Wrong',
        position: 'top',
      });
      return false;
      // setAddLoading(false);
    }
  } catch (error) {
    console.log('Error onSubmitOtp ', error);
    return false;
  }
};
