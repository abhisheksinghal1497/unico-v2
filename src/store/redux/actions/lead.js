import { leadActions } from '../slices/LeadSlice';
import { QueryObject } from '../../../services/QueryObject';
import { GetListViews } from '../../../services/GetRequestService/GetListViews';
import { GetListViewMetadata } from '../../../services/GetRequestService/GetListViewMetadata';
import { ModifySqlOrderClause } from '../../../utils/modifySqlOrderClause';

export const getLeadsByQuery = (query) => {
  return async (dispatch) => {
    try {
      // console.log('Entered');
      dispatch(
        leadActions.getLeads({
          lead: { hasError: false, leads: [], loading: true },
        })
      );
      const leadList = await QueryObject(query);

      dispatch(
        leadActions.getLeads({
          lead: { hasError: false, leads: leadList, loading: false },
        })
      );
    } catch (error) {
      dispatch(
        leadActions.getLeads({
          lead: { hasError: true, leads: [], loading: false },
        })
      );
      console.log('Get Leads Error', error);
    }
  };
};
export const getLeadById = (query) => {
  return async (dispatch) => {
    try {
      const leadList = await QueryObject(query);

      dispatch(
        leadActions.getLeadById({
          singleLead: { hasError: false, lead: leadList },
        })
      );
    } catch (error) {
      dispatch(
        leadActions.getLeadById({ singleLead: { hasError: true, lead: [] } })
      );
      console.log('Get Leads Error', error);
    }
  };
};
export const getLeadListViews = () => {
  return async (dispatch) => {
    try {
      await dispatch(
        leadActions.getLeadListViews({
          leadListViews: {
            listViews: mappedListView,
            hasError: false,
            listViewLoading: true,
          },
        })
      );
      let leadListViews = await GetListViews('Lead');
      // console.log('leadListViews--------->', leadListViews);
      //   let defaultListView = await GetDefaultListView();
      let filteredList = leadListViews?.filter((list) => {
        if (list.developerName === 'AllOpenLeads') {
          list.default = true;
        } else {
          list.default = false;
        }
        return list.developerName != 'RecentlyViewedLeads';
      });
      // console.log('filteredList--------->', filteredList);

      //   let recentlyViewedList = await QueryObject(defaultListView?.query);
      //   console.log('Query running', defaultListView?.query);
      //   console.log('lead list views', recentlyViewedList);

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

      //   mappedListView.push(defaultListView);

      // console.log("mappedListView", mappedListView);

      await dispatch(
        leadActions.getLeadListViews({
          leadListViews: {
            listViews: mappedListView,
            hasError: false,
            listViewLoading: false,
          },
        })
      );
    } catch (error) {
      dispatch(
        leadActions.getLeadListViews({
          leadListViews: {
            listViews: [],
            hasError: true,
            listViewLoading: false,
          },
        })
      );
      console.log('Error LeadListViews', error);
    }
  };
};

// export const getListViewLeadsByUrl = (url) => {
//   return async (dispatch) => {
//     try {
//       let formattedUrl = url ? url.split('/').splice(3).join('/') : '';
//       let listViewMetadata = await GetListViewMetadata(formattedUrl);
//       let listViewLead = await QueryObject(listViewMetadata?.query);

//       dispatch(
//         leadActions.getLeads({
//           lead: { leads: listViewLead, hasError: false },
//         })
//       );
//     } catch (error) {
//       dispatch(
//         leadActions.getLeads({
//           lead: {
//             hasError: true,
//             leads: [],
//           },
//         })
//       );
//       console.log('Get ListView Leads Error', error);
//     }
//   };
// };

// export const getFilteredLeads = (status) => {
//   return async (dispatch) => {
//     try {
//       const leadList = await QueryObject(query.filterLeadQuery(status));

//       dispatch(
//         leadActions.getLeads({
//           lead: {
//             hasError: false,
//             leads: leadList,
//           },
//         })
//       );
//     } catch (error) {
//       dispatch(
//         leadActions.getLeads({
//           lead: {
//             hasError: true,
//             leads: [],
//           },
//         })
//       );
//       console.log('Get Leads Error', error);
//     }
//   };
// };
