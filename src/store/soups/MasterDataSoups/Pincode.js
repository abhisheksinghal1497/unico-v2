import { soupConfig } from '../../../common/constants/soupConstants';
import { query } from '../../../common/constants/Queries';
import { syncData } from '.';

let syncInFlight = false;

const syncDownName = soupConfig.pincodeMaster.syncDownName;

const soupName = soupConfig.pincodeMaster.soupName;

const SMARTSTORE_CHANGED = soupConfig.pincodeMaster.SMARTSTORE_CHANGED;

const queryData = query.getPincodeMasterData;
const objectName = soupConfig.pincodeMaster.objectName;

export const syncPincodeData = async () => {
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
