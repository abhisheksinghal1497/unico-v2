import { soupConfig } from "../../../common/constants/soupConstants";
import { query } from "../../../common/constants/Queries";
import { syncData } from ".";

let syncInFlight = false;

const syncDownName = soupConfig.locationMaster.syncDownName;

const soupName = soupConfig.locationMaster.soupName;

const SMARTSTORE_CHANGED = soupConfig.locationMaster.SMARTSTORE_CHANGED;

const queryData = query.getLocationMasterQuery;
const objectName = soupConfig.locationMaster.objectName;

export const syncLocationMasterData = async () => {
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
