import { net } from 'react-native-force';
import { QueryObject } from './QueryObject';
import { query } from '../common/constants/Queries';

export const SearchLead = (searchString, query) => {
  return new Promise((resolve, reject) => {
    net.search(
      // `FIND {${searchString}} IN ALL FIELDS RETURNING ${query} `,
      // status !== ''? `FIND {${searchString}} IN ALL FIELDS RETURNING Lead(Id, Name, Status, LeadSource, Lead_Id__c,CreatedDate WHERE Status='${status}' ORDER BY LASTMODIFIEDDATE DESC)`
      //   :
      `FIND {${searchString}} IN ALL FIELDS RETURNING Lead(Id, Name,FirstName,LastName, Status, LeadSource, Lead_Id__c,CreatedDate,Branch_Name__c,Channel_Name__r.Name ORDER BY LASTMODIFIEDDATE DESC)`,
      (res) => {
        resolve(res);
        // console.log('Search response', res);
      },
      (error) => {
        reject(error);
        // console.log('Search Error', error);
      }
    );
  });
};

export const getLeadsByStatus = async (status) => {
  try {
    const leadData = await QueryObject(query.filterLeadQuery(status));
    return leadData;
  } catch (error) {
    return error;
  }
};
