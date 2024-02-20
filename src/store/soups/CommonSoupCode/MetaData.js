import { getMetaData } from '../../../services/GetRequestService/GetMetaData';
import EventEmitter from '../../../utils/event';
import { promises } from '../../../utils/smartStorePromiser';

let syncInFlight = false;

const eventEmitter = new EventEmitter();

function emitSmartStoreChanged(SMARTSTORE_CHANGED) {
  eventEmitter.emit(SMARTSTORE_CHANGED, {});
}

export const firstTimeSyncMetaData = async (
  soupName,
  objectName,
  SMARTSTORE_CHANGED,
  objectType
) => {
  try {
    const indexSpecs = [
      { path: '__local__', type: 'string' },
      { path: 'name', type: 'string' },
    ];

    await promises.registerSoup(false, soupName, indexSpecs);
    await upsertMetaData(soupName, objectName, SMARTSTORE_CHANGED, objectType);
  } catch (error) {
    console.log(`FIRST TIME SYNC ERROR ${objectName}  METADATA:`, error);
  }
};

export const upsertMetaData = async (
  soupName,
  objectName,
  SMARTSTORE_CHANGED,
  objectType
) => {
  if (syncInFlight) {
    console.log(
      `Not starting ${objectName} UpsertMetaData - sync already in fligtht`
    );
    return Promise.resolve();
  }

  try {
    syncInFlight = true;
    await promises.clearSoup(false, soupName);
    // console.log("Success clear soup");

    const res = await getMetaData(objectType);
    // console.log('Response-----------MetaData', res);
    const metadata = res.fields.filter(
      (field) => field.createable === true || field.updateable === true
    );

    await promises.upsertSoupEntries(false, soupName, metadata);
    console.log(`SuccessUpsert ${objectName} Meta Data`);

    syncInFlight = false;
    emitSmartStoreChanged(SMARTSTORE_CHANGED);
  } catch (error) {
    syncInFlight = false;
    console.log(`ErrorUpsert ${objectName} MetaData `, error);
  }
};

export const syncMetaData = async (
  soupName,
  objectName,
  SMARTSTORE_CHANGED,
  objectType
) => {
  try {
    const sync = await promises.soupExists(false, soupName);
    if (!sync) {
      return firstTimeSyncMetaData(
        soupName,
        objectName,
        SMARTSTORE_CHANGED,
        objectType
      );
    } else {
      console.log(`${objectName} already synced`);
      return;
      //   upsertMetaData(
      //     soupName,
      //     objectName,
      //     SMARTSTORE_CHANGED,
      //     objectType
      //   );
    }
  } catch (error) {
    console.log(`ERROR ${objectName} syncMetaData `, error);
  }
};
