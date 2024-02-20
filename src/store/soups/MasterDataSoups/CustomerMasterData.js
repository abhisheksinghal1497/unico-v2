import { soupConfig } from '../../../common/constants/soupConstants';
import { query } from '../../../common/constants/Queries';
import { syncData } from '.';

let syncInFlight = false;

const syncDownName = soupConfig.customerMaster.syncDownName;

const soupName = soupConfig.customerMaster.soupName;

const SMARTSTORE_CHANGED = soupConfig.customerMaster.SMARTSTORE_CHANGED;

const queryData = query.getCustomerMasterData;
const objectName = soupConfig.customerMaster.objectName;

export const syncCustomerMasterData = async () => {
  try {
    return await syncData(
      queryData,
      syncDownName,
      syncInFlight,
      soupName,
      SMARTSTORE_CHANGED,
      objectName
    );
  } catch (error) {
    console.log(`${objectName} Error`, error);
  }
};
