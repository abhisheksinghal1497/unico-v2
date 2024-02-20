import { soupConfig } from '../../../common/constants/soupConstants';
import { getThById } from '../../../common/functions/getTeamHierarchyByUserId';
import { QuerySoup } from '../../../services/QuerySoup';
import { teamHeirarchyAction } from '../slices/TeamHeirarchySlice';

export const getTeamHeirarchyByUserId = () => {
  return async (dispatch) => {
    try {
      const thById = await getThById();
      // console.log("Team Heirarchy", thById);
      dispatch(
        teamHeirarchyAction.getTeamHeirarchyByUserId({
          teamHeirarchyById: {
            teamHeirarchyByUserId: thById,
            hasError: false,
          },
        })
      );
    } catch (error) {
      dispatch(
        teamHeirarchyAction.getTeamHeirarchyByUserId({
          teamHeirarchyById: {
            hasError: true,
            teamHeirarchyByUserId: {},
          },
        })
      );
    }
  };
};
export const getThMaster = () => {
  return async (dispatch) => {
    try {
      const thMaster = await QuerySoup(
        soupConfig.teamHierarchy.soupName,
        soupConfig.teamHierarchy.queryPath,
        soupConfig.teamHierarchy.pageSize
      );
      // console.log('Team Heirarchy', thMaster);
      dispatch(
        teamHeirarchyAction.getTeamHeirarchyMaster({
          teamHeirarchyMaster: {
            teamHeirarchyMasterData: thMaster,
            hasError: false,
          },
        })
      );
    } catch (error) {
      dispatch(
        teamHeirarchyAction.getTeamHeirarchyByUserId({
          teamHeirarchyMaster: {
            hasError: true,
            teamHeirarchyMasterData: [],
          },
        })
      );
    }
  };
};
