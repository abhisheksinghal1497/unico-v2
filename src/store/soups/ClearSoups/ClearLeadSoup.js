import { soupConfig } from '../../../common/constants/soupConstants';
import { QuerySoup } from '../../../services/QuerySoup';
import { promises } from '../../../utils/smartStorePromiser';
import RNFS from 'react-native-fs';
export const ClearLeadSoup = async () => {
  try {
    // RNFS.readFile('',)

    const offlineLeads = await QuerySoup(
      soupConfig.lead.soupName,
      soupConfig.lead.queryPath,
      soupConfig.lead.pageSize
    );

    let clearSoupIds = [];

    if (offlineLeads.length > 0) {
      for (let i = 0; i < offlineLeads.length; i++) {
        if (
          offlineLeads[i].hasOwnProperty('__last_error__') ||
          offlineLeads[i].__locally_created__ ||
          offlineLeads[i].__locally_updated__ ||
          offlineLeads[i].__local__ ||
          offlineLeads[i].__locally_deleted__
        ) {
          continue;
        } else {
          if (offlineLeads[i].fileDetails.length > 0) {
            continue;
          } else {
            clearSoupIds.push(offlineLeads[i]._soupEntryId);
          }
        }
      }
    }
  } catch (error) {
    console.log('Error ClearLeadSoup', error);
  }
};
