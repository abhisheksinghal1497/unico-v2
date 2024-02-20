import { mobilesync, smartstore } from 'react-native-force';
import EventEmitter from '../../../utils/event';
import { promises } from '../../../utils/smartStorePromiser';
const eventEmitter = new EventEmitter();

function emitSmartStoreChanged(SMARTSTORE_CHANGED) {
  eventEmitter.emit(SMARTSTORE_CHANGED, {});
}

export const firstTimeSyncData = async (soupName, objectName) => {
  try {
    const indexSpecs = [
      { path: '__local__', type: 'string' },
      { path: 'Id', type: 'string' },
    ];

    await promises.registerSoup(false, soupName, indexSpecs);
    // console.log('soup Exists', await promises.soupExists(false, soupName));
  } catch (error) {
    console.log(`FIRST TIME SYNC ERROR ${objectName}:`, error);
  }
};

export const syncUpData = async (
  fieldlist,
  objectName,
  SMARTSTORE_CHANGED,
  soupName,
  syncInFlight
) => {
  if (syncInFlight) {
    console.log(`Not starting ${objectName} syncUp - sync already in fligtht`);
    return Promise.resolve();
  }

  try {
    console.log(`Starting ${objectName} syncup`);
    syncInFlight = true;

    await promises.syncUp(
      false,
      {},
      soupName,
      { mergeMode: mobilesync.MERGE_MODE.OVERWRITE, fieldlist }
      // syncUpName
    );

    console.log(`${objectName} syncUp completed`);
    syncInFlight = false;
    emitSmartStoreChanged(SMARTSTORE_CHANGED);
  } catch (error) {
    syncInFlight = false;
    console.log(`SYNCUP ${objectName} ERROR :`, error);
    return error;
  }
};

export const syncDataUp = async (
  syncName,
  syncInFlight,
  soupName,
  SMARTSTORE_CHANGED,
  fieldlist,
  objectName
) => {
  try {
    // const sync = await promises.getSyncStatus(false, syncName);
    const soupExist = await promises.soupExists(false, soupName);
    if (!soupExist) {
      console.log('sync Status..............', soupName, objectName);
      return firstTimeSyncData(soupName, objectName);
    } else {
      return reSyncData(
        // sync?._soupEntryId,
        syncName,
        syncInFlight,
        SMARTSTORE_CHANGED,
        fieldlist,
        objectName,
        soupName
      );
    }
  } catch (error) {
    console.log(`SYNC ${objectName} DATA ERROR:`, error);
  }
};

export const reSyncData = async (
  // syncId,
  syncName,
  syncInFlight,
  SMARTSTORE_CHANGED,
  fieldlist,
  objectName,
  soupName
) => {
  await syncUpData(
    fieldlist,
    objectName,
    SMARTSTORE_CHANGED,
    soupName,
    syncInFlight
  );
};

export const updateRecordOffline = async (
  data,
  objectName,
  soupName,
  SMARTSTORE_CHANGED,
  isMultipleEntries = false
) => {
  let record = [];
  if (isMultipleEntries) {
    data?.map((item) => {
      record.push({
        ...item,
        attributes: { type: `${objectName}` },
        __locally_updated__: true,
        __locally_deleted__: false,
        __local__: true,
      });
    });
  } else {
    record.push({
      ...data,
      attributes: { type: `${objectName}` },
      __locally_updated__: true,
      __locally_deleted__: false,
      __local__: true,
    });
  }

  try {
    const res = await promises.upsertSoupEntries(false, soupName, record);
    // console.log("Record Updated", res);
    emitSmartStoreChanged(SMARTSTORE_CHANGED);
    return { success: true, res };
  } catch (error) {
    console.log(`Update Record in ${objectName} Error`, error);
    return { success: false, error };
  }
};
export const saveRecordOffline = async (
  data,
  objectName,
  soupName,
  SMARTSTORE_CHANGED
) => {
  let Id = `local_${new Date().getTime()}`;
  const record = {
    ...data,
    Id: Id,
    localId: Id,
    attributes: { type: `${objectName}` },
    CreatedDate: new Date().toISOString(),
    __locally_created__: true,
    __locally_updated__: false,
    __locally_deleted__: false,
    __local__: true,
  };

  try {
    const res = await promises.upsertSoupEntries(false, soupName, [record]);
    console.log(`Save Record in offline mode`, res);
    emitSmartStoreChanged(SMARTSTORE_CHANGED);
    return { success: true, res };
  } catch (error) {
    console.log(`Save Record in ${objectName} Error`, error);
    return { success: false, error };
  }
};
