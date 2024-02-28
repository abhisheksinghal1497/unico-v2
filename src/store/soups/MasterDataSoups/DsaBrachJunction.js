// Channel Name And Channel code Will come From Dsa Branch Junction
//Dsa Branch Junction  will have a lookup to user so the Data should be fetched according to the user logged in
//Account is a lookup on this DSA Branch Junction and we have to do a realtive query Account__r.Name, Account__r.RecordType.name

//Query = Select Id, Account__r.Name, Account__r.RecordType.name from DSABrnJn where user=logge in user id
// From Account__r.Name you will get Channel Name and From Account__r.RecordType.name you will get DSA and connector Value for Lead Source refrence .... if Lead Source is selected as DSA then only show Account name whose RecordType.Name value is DSA and Vice versa

// Suppose if i select DSA in lead Source then i should show only DSA Records ELse if i select connector then show only connector records

import { soupConfig } from '../../../common/constants/soupConstants';
import { query } from '../../../common/constants/Queries';
import { syncData } from '.';

let syncInFlight = false;

let syncDownName = soupConfig.dsaBrJn.syncDownName;

const soupName = soupConfig.dsaBrJn.soupName;

const SMARTSTORE_CHANGED = soupConfig.dsaBrJn.SMARTSTORE_CHANGED;

const objectName = soupConfig.dsaBrJn.objectName;

export const syncDSABrJnData = async (userId) => {
  try {
    const queryData = await query.getDsaBranchJunction(userId);

    console.log('queryData', queryData);

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
