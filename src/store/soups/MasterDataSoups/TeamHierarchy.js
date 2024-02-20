import { soupConfig } from '../../../common/constants/soupConstants';
import { query } from '../../../common/constants/Queries';
import { syncData } from '.';

let syncInFlight = false;

let syncDownName = soupConfig.teamHierarchy.syncDownName;

const soupName = soupConfig.teamHierarchy.soupName;

const SMARTSTORE_CHANGED = soupConfig.teamHierarchy.SMARTSTORE_CHANGED;

const objectName = soupConfig.teamHierarchy.objectName;

export const syncTeamHierarchyData = async (userId) => {
  try {
    // console.log("userId", userId);
    const queryData = await query.getTeamHierarchyQuery;
    // console.log('Query Data', queryData);
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
