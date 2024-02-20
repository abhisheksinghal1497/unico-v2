import { soupConfig } from '../../../common/constants/soupConstants';
import { QuerySoup } from '../../../services/QuerySoup';
import { leadMetadataActions } from '../slices/LeadMetaData';

export const getLeadMetadata = () => {
  return async (dispatch) => {
    try {
      const leadMetadata = await QuerySoup(
        soupConfig.leadMetaData.soupName,
        soupConfig.leadMetaData.queryPath,
        100
      );
      //   console.log('Leads Meta', leadMetadata);
      dispatch(
        leadMetadataActions.getLeadMetaData({
          leadMetadata: leadMetadata,
          hasError: false,
        })
      );
    } catch (error) {
      dispatch(
        leadMetadataActions.getLeadMetaData({
          leadMetadata: [],
          hasError: false,
        })
      );
    }
  };
};
