import createDynamicApexReq from '../../../common/components/DynamicFormComponents/Handlers/CreateDynamicApexReq';
import { createDynamicCompositeReq } from '../../../common/components/DynamicFormComponents/Handlers/CreateDynamicCompositeRequest';
import { compositeGraphApi } from '../../../services/CompositeRequests/graphRequest';
import { UpdateQuestionsJson } from '../../../services/PostRequestService/UpdateQuestionJson';

export const DynamicFormDraftHandlerPD = async (data, Id) => {
  try {
    // let data = watch();
    let compositeRequest = await createDynamicCompositeReq(data?.PD);

    let apexReqData = await createDynamicApexReq(data?.PD, Id, false);
    // ----------------------------------------------
    let count = 0;

    apexReqData.map((record) => {
      if (record.objectType === 'PD__c') {
        count++;
        record.records[0].PDStatus__c = 'In Progress';
      }
    });
    if (count === 0) {
      apexReqData.push({
        objectType: 'PD__c',
        records: [
          {
            Id: Id,
            attributes: {
              type: 'PD__c',
            },
            PDStatus__c: 'In Progress',
          },
        ],
      });
    }
    // -----------------------------------------
    let apexRes = await UpdateQuestionsJson(
      Id,
      'PersonalDiscussion',
      apexReqData
    );
    let graphRes = await compositeGraphApi([
      {
        graphId: '1',
        compositeRequest,
      },
    ]);

    // console.log(
    //   "graphRes---------------------------------------->",
    //   JSON.stringify(graphRes)
    // );

    if (graphRes.graphs[0].isSuccessful && apexRes.isSuccess) {
      //console.log("apexRes", apexRes);
      return apexRes;
    } else {
      return { isSuccess: false };
    }
  } catch (error) {
    console.log('Error DynamicFormOnSubmitHandler', error);
  }
};
