import { soupConfig } from '../../../common/constants/soupConstants';
import { query } from '../../../common/constants/Queries';
import { syncData } from '.';

let syncInFlight = false;

const syncDownName = soupConfig.locationBrJnMaster.syncDownName;

const soupName = soupConfig.locationBrJnMaster.soupName;

const SMARTSTORE_CHANGED = soupConfig.locationBrJnMaster.SMARTSTORE_CHANGED;

const queryData = query.getLocationBrJnMasterData;
const objectName = soupConfig.locationBrJnMaster.objectName;

export const syncLocationBrJnData = async () => {
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
