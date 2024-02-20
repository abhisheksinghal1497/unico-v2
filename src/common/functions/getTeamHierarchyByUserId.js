import { oauth } from 'react-native-force';
import { QuerySoup } from '../../services/QuerySoup';
import { soupConfig } from '../constants/soupConstants';
import { getAuthCredentials } from '../../services/GetRequestService/GetAuthCredentials';

export const getThById = async () => {
  try {
    let thById;
    const thMaster = await QuerySoup(
      soupConfig.teamHierarchy.soupName,
      soupConfig.teamHierarchy.queryPath,
      soupConfig.teamHierarchy.pageSize
    );
    //   console.log('Team HierarchyMaster', thMaster);
    // .then((result) => {
    const res = await getAuthCredentials();
    thById = thMaster?.find((value) => value?.Employee__c === res?.userId);
    //   console.log('Team HierarchyMaster---', thById);
    // console.log('th: ', thById);
    return thById;
  } catch (error) {
    console.log('Error getThById ', error);
    return [];
  }
};
