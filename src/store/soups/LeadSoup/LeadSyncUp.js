import { syncDataUp } from '.';
import { soupConfig } from '../../../common/constants/soupConstants';

let syncInFlight = false;

let syncName = soupConfig.lead.syncName;

const soupName = soupConfig.lead.soupName;

const SMARTSTORE_CHANGED = soupConfig.lead.SMARTSTORE_CHANGED;

const objectName = soupConfig.lead.objectName;

const fieldList = soupConfig.lead.fieldList;

const leadSyncUp = async () => {
  try {
    // console.log('Entered------1');
    return await syncDataUp(
      syncName,
      syncInFlight,
      soupName,
      SMARTSTORE_CHANGED,
      fieldList,
      objectName
    );
  } catch (error) {
    console.log(`Error on leadSyncUp`, error);
  }
};
export default leadSyncUp;
