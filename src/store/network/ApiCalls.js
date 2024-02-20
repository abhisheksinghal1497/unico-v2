import { ErrorMessages } from '../../global/constants/ErrorConstants';
import { GetListViewMetadata } from '../../services/GetRequestService/GetListViewMetadata';
import { GetListViews } from '../../services/GetRequestService/GetListViews';
import { SearchLead } from '../../services/SearchLead';
import { ModifySqlOrderClause } from '../../src/utils/modifySqlOrderClause';

export const GetLeadListViewsApi = async () => {
  try {
    let leadListViews = await GetListViews('Lead');
    let filteredList = leadListViews?.filter((list) => {
      if (list.developerName === 'AllOpenLeads') {
        list.default = true;
      } else {
        list.default = false;
      }
      return list.developerName != 'RecentlyViewedLeads';
    });

    let mappedListView = await Promise.all(
      filteredList.map(async (value) => {
        let formattedUrl = value?.describeUrl
          ? value.describeUrl.split('/').splice(3).join('/')
          : '';
        let listViewMetadata = await GetListViewMetadata(formattedUrl);
        value.query = ModifySqlOrderClause(listViewMetadata?.query);
        return value;
      })
    );
    return mappedListView;
  } catch (error) {
    throw ErrorMessages.noRecords;
  }
};

export const SearchLeadApi = async (searchString) => {
  try {
    const res = await SearchLead(searchString);
    return res?.searchRecords;
  } catch (error) {
    console.log('Search Lead Error', error);
  }
};
