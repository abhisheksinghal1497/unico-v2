import { QuerySoupById } from '../../services/QueryRequests/QuerySoupById';

export const GetSoupEntryIdIfExist = async (
  id,
  soupName,
  queryPath,
  pageSize
) => {
  try {
    let offlineLead = await QuerySoupById(soupName, queryPath, id, pageSize);

    if (offlineLead?.length > 0) {
      return offlineLead[0]._soupEntryId;
    } else {
      return null;
    }
  } catch (error) {
    console.log('Error GetSoupEntryIdIfExist', error);
    return null;
  }
};
