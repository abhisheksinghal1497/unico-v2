import { query } from "../../../../common/constants/Queries";
import { soupConfig } from "../../../../common/constants/soupConstants";
import { promises } from "../../../../utils/smartStorePromiser";
import { firstTimeSyncData } from "../../MasterDataSoups";

let syncInFlight = false;

// const syncDownName = soupConfig.PDList.syncDownName;

const soupName = soupConfig.PDList.soupName;

// const SMARTSTORE_CHANGED = soupConfig.PDList.SMARTSTORE_CHANGED;

// const queryData = query.getPdListQuery;

const objectName = soupConfig.PDList.objectName;

export const registerPDListSoup = async () => {
  try {
    // console.log(
    //   'PD Soup Exist',
    //   await promises.soupExists(false, soupConfig.PDList.soupName),
    //   soupConfig.PDList.soupName
    // );
    if (await promises.soupExists(false, soupName)) {
      return;
    }
    return await firstTimeSyncData(soupName, objectName);
  } catch (error) {
    console.log(`${objectName} Error`, error);
  }
};
