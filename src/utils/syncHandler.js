import { syncProductMappingData } from '../store/soups/MasterDataSoups/ProductMapping';
import leadSyncUp from '../store/soups/LeadSoup/LeadSyncUp';
// import { ROLES } from '../common/constants/globalConstants';
import { resyncLeadMetaData } from '../store/soups/MasterDataSoups/LeadMetaData';
import { syncCustomerMasterData } from '../store/soups/MasterDataSoups/CustomerMasterData';
import { getThById } from '../common/functions/getTeamHierarchyByUserId';
import { syncPincodeData } from '../store/soups/MasterDataSoups/Pincode';

export const SyncHandler = async () => {
  try {
    await resyncLeadMetaData();
    // await syncLocationMasterData();
    //  else if(ROLES.LEAD_CAPTURE.includes(empRole)){
    let teamHeirarchyByUserId = await getThById();
    // console.log('teamHeirarchyByUserId---------->', teamHeirarchyByUserId);
    teamHeirarchyByUserId &&
      (await syncProductMappingData(teamHeirarchyByUserId));
    await syncCustomerMasterData();
    // await syncbankBranchMasterData();
    await syncPincodeData();
    // await syncLocationBrJnData();
    await leadSyncUp();
  } catch (error) {
    console.log('Error SyncHandler ', error);
    return error;
  }
};
