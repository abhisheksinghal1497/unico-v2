// import { pdActions } from "../slices/LeadSlice";
import { QueryObject } from "../../../services/QueryObject";
import { query } from "../../../common/constants/Queries";
import { pdActions } from "../slices/PdListSlice";
import { soupConfig } from "../../../common/constants/soupConstants";
import { QuerySoup } from "../../../services/QuerySoup";
import { oauth } from "react-native-force";

export const getPdListByQuery = (isOnline) => {
  return async (dispatch) => {
    try {
      let pdListData = [];
      dispatch(
        pdActions.getPdList({
          pdList: { hasError: false, pd: [], loading: true },
        })
      );
      oauth.getAuthCredentials(
        async (credentials) => {
          // console.log('Credentials', credentials, isOnline);
          // if (isOnline) {
          if (isOnline) {
            pdListData =
              credentials &&
              (await QueryObject(query.getPdListQuery(credentials?.userId)));
          } else {
            const cachedData = await QuerySoup(
              soupConfig.PDList.soupName,
              soupConfig.PDList.queryPath,
              soupConfig.PDList.pageSize
            );
            pdListData = { records: cachedData };
          }
          dispatch(
            pdActions.getPdList({
              pdList: { hasError: false, pd: pdListData, loading: false },
            })
          );
          // }
        },
        (err) => {
          console.log("Error getting Auth Credentials in Sync Handler ", err);
        }
      );
      // console.log('Entered', isOnline);

      // console.log('pdListData', pdListData);
    } catch (error) {
      dispatch(
        pdActions.getPdList({
          pdList: { hasError: true, pd: [], loading: false },
        })
      );
      console.log("Get PD List Error", error);
    }
  };
};
export const getPdById = (query) => {
  return async (dispatch) => {
    try {
      const pdListData = await QueryObject(query);

      dispatch(
        pdActions.getPdById({
          singlePd: { hasError: false, pd: pdListData },
        })
      );
    } catch (error) {
      dispatch(pdActions.getPdById({ singlePd: { hasError: true, pd: [] } }));
      console.log("Get PD Error", error);
    }
  };
};
