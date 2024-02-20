import { forceUtil, mobilesync, smartstore } from 'react-native-force';

export const promises = {
  registerSoup: forceUtil.promiser(smartstore.registerSoup),
  clearSoup: forceUtil.promiser(smartstore.clearSoup),
  removeFromSoup: forceUtil.promiser(smartstore.removeFromSoup),
  soupExists: forceUtil.promiser(smartstore.soupExists),
  cleanResyncGhosts: forceUtil.promiser(mobilesync.cleanResyncGhosts),
  getSyncStatus: forceUtil.promiser(mobilesync.getSyncStatus),
  syncDown: forceUtil.promiserNoRejection(mobilesync.syncDown),
  syncUp: forceUtil.promiserNoRejection(mobilesync.syncUp),
  reSync: forceUtil.promiserNoRejection(mobilesync.reSync),
  removeSoup: forceUtil.promiserNoRejection(smartstore.removeSoup),

  upsertSoupEntries: forceUtil.promiser(smartstore.upsertSoupEntries),

  querySoup: forceUtil.promiser(smartstore.querySoup),
};
