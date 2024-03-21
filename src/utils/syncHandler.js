import { syncProductMappingData } from '../store/soups/MasterDataSoups/ProductMapping';
import leadSyncUp from '../store/soups/LeadSoup/LeadSyncUp';
// import { ROLES } from '../common/constants/globalConstants';
import { resyncLeadMetaData } from '../store/soups/MasterDataSoups/LeadMetaData';
import { syncCustomerMasterData } from '../store/soups/MasterDataSoups/CustomerMasterData';
import { syncPincodeData } from '../store/soups/MasterDataSoups/Pincode';

export const SyncHandler = async () => {
  try {
    await resyncLeadMetaData();
    // await syncLocationMasterData();
    //  else if(ROLES.LEAD_CAPTURE.includes(empRole)){
    // console.log('teamHeirarchyByUserId---------->', teamHeirarchyByUserId);

    await syncProductMappingData();
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
