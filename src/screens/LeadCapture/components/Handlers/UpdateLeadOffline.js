import { soupConfig } from '../../../../common/constants/soupConstants';
import { GetSoupEntryIdIfExist } from '../../../../common/functions/GetSoupEntryId';
import { updateRecordOffline } from '../../../../store/soups/LeadSoup';

const updateLeadoffline = async (leadData) => {
  try {
    let data = { ...leadData };

    let _soupEntryId = await GetSoupEntryIdIfExist(
      data.Id,
      soupConfig.lead.soupName,
      soupConfig.lead.queryPath,
      soupConfig.lead.pageSize
    );
    data._soupEntryId = _soupEntryId;

    let res = await updateRecordOffline(
      data,
      soupConfig.lead.objectName,
      soupConfig.lead.soupName,
      soupConfig.lead.SMARTSTORE_CHANGED
    );
  } catch (error) {
    console.error('Error in updateLeadOffline:', error);
  }
};

export default updateLeadoffline;
