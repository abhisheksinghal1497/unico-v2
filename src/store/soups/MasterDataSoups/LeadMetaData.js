import { soupConfig } from '../../../common/constants/soupConstants';
import { promises } from '../../../utils/smartStorePromiser';
import {
  firstTimeSyncMetaData,
  syncMetaData,
} from '../CommonSoupCode/MetaData';

const soupName = soupConfig.leadMetaData.soupName;

const SMARTSTORE_CHANGED = soupConfig.leadMetaData.SMARTSTORE_CHANGED;

const objectName = soupConfig.leadMetaData.objectName;

const objectType = soupConfig.leadMetaData.objectType;

export const syncLeadMetaData = async () => {
  try {
    const sync = await promises.soupExists(false, soupName);
    if (!sync) {
      return await firstTimeSyncMetaData(
        soupName,
        objectName,
        SMARTSTORE_CHANGED,
        objectType
      );
    } else {
      return;
    }
  } catch (error) {
    console.log(`Error ${objectName} MetaData Syncing`, error);
  }
};

export const resyncLeadMetaData = async () => {
  try {
    return await syncMetaData(
      soupName,
      objectName,
      SMARTSTORE_CHANGED,
      objectType
    );
  } catch (error) {
    console.log(`Error ${objectName} MetaData Syncing`, error);
  }
};
