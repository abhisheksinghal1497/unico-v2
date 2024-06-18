import { mobilesync } from "react-native-force";
import { EventEmitter } from "../../../utils/event";
import { promises } from "../../../utils/smartStorePromiser";

const eventEmitter = new EventEmitter();

function emitSmartStoreChanged(SMARTSTORE_CHANGED) {
  eventEmitter.emit(SMARTSTORE_CHANGED, {});
}

export const firstTimeSyncData = async (soupName, objectName, index = []) => {
  try {
    const indexSpecs = [
      { path: "__local__", type: "string" },
      { path: "Id", type: "string" },
      ...index,
    ];
    await promises.registerSoup(false, soupName, indexSpecs);
  } catch (error) {
    console.log(`FIRST TIME SYNC ERROR ${objectName}:`, error);
  }
};

export const syncDownData = async (
  query,
  syncDownName,
  syncInFlight,
  soupName,
  SMARTSTORE_CHANGED,
  objectName
) => {
  if (syncInFlight) {
    console.log(
      `Not starting ${objectName} syncDown - sync already in fligtht`
    );
    return Promise.resolve();
  }

  console.log(`Starting ${objectName} syncDown`);
  syncInFlight = true;

  const target = {
    type: "soql",
    query: query,
  };

  try {
    const res = await promises.syncDown(
      false,
      target,
      soupName,
      { mergeMode: mobilesync.MERGE_MODE.OVERWRITE }
      // syncDownName
    );

    console.log(`${objectName} syncDown completed`);
    syncInFlight = false;
    emitSmartStoreChanged(SMARTSTORE_CHANGED);
  } catch (error) {
    syncInFlight = false;
    console.log(`SYNCDOWN ${objectName} ERROR :`, error);
    return error;
  }
};

export const syncData = async (
  query,
  syncDownName,
  syncInFlight,
  soupName,
  SMARTSTORE_CHANGED,
  objectName
) => {
  try {
    const sync = await promises.getSyncStatus(false, syncDownName);
    // console.log('sync Status..............', sync);
    if (sync === null) {
      await firstTimeSyncData(soupName, objectName);
      return await syncDownData(
        query,
        syncDownName,
        syncInFlight,
        soupName,
        SMARTSTORE_CHANGED,
        objectName
      );
    } else {
      // return reSyncData(
      //   sync?._soupEntryId,
      //   syncDownName,
      //   syncInFlight,
      //   SMARTSTORE_CHANGED,
      //   objectName
      // );
      return await syncDownData(
        query,
        syncDownName,
        syncInFlight,
        soupName,
        SMARTSTORE_CHANGED,
        objectName
      );
    }
  } catch (error) {
    console.log(`SYNC ${objectName} DATA ERROR:`, error);
  }
};

export const reSyncData = async (
  syncId,
  syncDownName,
  syncInFlight,
  SMARTSTORE_CHANGED,
  objectName
) => {
  await reSync(syncDownName, syncInFlight, SMARTSTORE_CHANGED, objectName);
  await cleanResyncGhosts(syncId, syncInFlight, SMARTSTORE_CHANGED, objectName);
};

export const cleanResyncGhosts = async (
  syncId,
  syncInFlight,
  SMARTSTORE_CHANGED,
  objectName
) => {
  if (syncInFlight) {
    console.log(
      `Not starting ${objectName} cleanResyncGhosts - sync already in fligtht`
    );
    return Promise.resolve();
  }

  try {
    syncInFlight = true;
    await promises.cleanResyncGhosts(false, syncId);
    syncInFlight = false;
    emitSmartStoreChanged(SMARTSTORE_CHANGED);
  } catch (error) {
    syncInFlight = false;
    return error;
  }
};

export const reSync = async (
  syncDownName,
  syncInFlight,
  SMARTSTORE_CHANGED,
  objectName
) => {
  if (syncInFlight) {
    console.log(`Not starting ${objectName} reSync - sync already in fligtht`);
    return Promise.resolve();
  }

  console.log(`Starting ${objectName} reSync`);

  try {
    syncInFlight = true;
    const res = await promises.reSync(false, syncDownName);
    syncInFlight = false;
    emitSmartStoreChanged(SMARTSTORE_CHANGED);
  } catch (error) {
    syncInFlight = false;
    return error;
  }
};
