import { soupConfig } from '../../../common/constants/soupConstants';
import { FormatFormJson } from '../../../common/functions/FormatFormJson';
import { GetQuestionsJson } from '../../../services/GetRequestService/GetQuestionJson';
import { QuerySoupById } from '../../../services/QueryRequests/QuerySoupById';

export const getPDQuestionJson = async (Id, isOnline) => {
  try {
    if (isOnline) {
      let res = await GetQuestionsJson(Id, 'PersonalDiscussion');
      if (res.isSuccess) {
        // setPDLoading(false);
        let formattedJson =  FormatFormJson(res?.responseData);
        // setPdJson(formattedJson);
        return formattedJson;
        // console.log("Formatted Json", formattedJson);
        // console.log('Get Json', res);
        // setErrorState(false);
      } else {
        console.log('Error Fetching PD form Data', res.errorMessage);
        // setPDLoading(false);
        // setErrorState(true);
        return [];
      }
    } else {
      let getPd = await QuerySoupById(
        soupConfig.PDForm.soupName,
        soupConfig.PDForm.queryPath,
        Id,
        soupConfig.PDForm.pageSize
      );
      // console.log('Get PD Form Offline', getPd);
      // setPdJson(getPd?.length > 0 ? getPd[0].PD : []);
      return getPd?.length > 0 ? getPd[0].PD : [];
    }
  } catch (error) {
    console.log('Error getQuestionJson', error);
    // setErrorState(true);
    throw error;
  }
};
