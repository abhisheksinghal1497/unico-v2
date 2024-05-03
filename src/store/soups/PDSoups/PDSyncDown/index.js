import { soupConfig } from "../../../../common/constants/soupConstants";
import { promises } from "../../../../utils/smartStorePromiser";
import { firstTimeSyncData } from "../../MasterDataSoups";

let syncInFlight = false;

const soupName = soupConfig.PDForm.soupName;
const objectName = soupConfig.PDForm.objectName;

export const registerPDFormSoup = async () => {
  try {
    if (await promises.soupExists(false, soupName)) {
      return;
    }
    return await firstTimeSyncData(soupName, objectName, [
      { path: "recordId", type: "string" },
    ]);
  } catch (error) {
    console.log(`${objectName} Error`, error);
  }
};
