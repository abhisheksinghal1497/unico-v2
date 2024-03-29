import { soupConfig } from '../../../common/constants/soupConstants';
import { query } from '../../../common/constants/Queries';
import { syncData } from '.';
import { getProductType } from '../../../common/functions/getProductType';

let syncInFlight = false;

const syncDownName = soupConfig.productMapping.syncDownName;

const soupName = soupConfig.productMapping.soupName;

const SMARTSTORE_CHANGED = soupConfig.productMapping.SMARTSTORE_CHANGED;

const objectName = soupConfig.productMapping.objectName;

export const syncProductMappingData = async () => {
  try {
    // const { productType } = await getProductType(teamHeirarchyByUserId);

    // console.log('product Type', productType);
    const queryData = query.getProductMapping;
    console.log('Query', queryData);
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
