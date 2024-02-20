import { soupConfig } from '../../../common/constants/soupConstants';
import { query } from '../../../common/constants/Queries';
import { syncData } from '.';

let syncInFlight = false;

const syncDownName = soupConfig.bankBranchMaster.syncDownName;

const soupName = soupConfig.bankBranchMaster.soupName;

const SMARTSTORE_CHANGED = soupConfig.bankBranchMaster.SMARTSTORE_CHANGED;

const queryData = query.getBankBranchMasterData;
const objectName = soupConfig.bankBranchMaster.objectName;

export const syncbankBranchMasterData = async () => {
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
