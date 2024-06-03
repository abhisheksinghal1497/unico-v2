import { compositeGraphApi } from "../../../../services/CompositeRequests/graphRequest";
import { UpdateQuestionsJson } from "../../../../services/PostRequestService/UpdateQuestionJson";
import createDynamicApexReq from "./CreateDynamicApexReq";
import { createDynamicCompositeReq } from "./CreateDynamicCompositeRequest";

export const DynamicFormOnSubmitHandler = async (formData, Id) => {
  try {
    let data = formData?.PD;

    console.log(
      "DynamicFormOnSubmitHandler data 1",
      formData?.PD?.map((section) => {
        return section?.questions?.filter(
          (question) => question.overrideCnfg !== null
        );
      })
    );

    let compositeRequest = await createDynamicCompositeReq(data);
    let apexReqData = await createDynamicApexReq(data, Id, true);
    // -------------------------------------------
    let count = 0;

    apexReqData.map((record) => {
      if (record.objectType === "PD__c") {
        count++;
        record.records[0].IsCompleted__c = true;
        record.records[0].PDStatus__c = "Completed";
      }
    });
    if (count === 0) {
      apexReqData.push({
        objectType: "PD__c",
        records: [
          {
            Id: Id,
            attributes: {
              type: "PD__c",
            },
            IsCompleted__c: true,
          },
          {
            Id: Id,
            attributes: {
              type: "PD__c",
            },
            PDStatus__c: "Completed",
          },
        ],
      });
    }
    // ------------------------------------
    console.log(
      "apexReqData---------------------------------------->",
      apexReqData
    );
    let apexRes = await UpdateQuestionsJson(
      Id,
      "PersonalDiscussion",
      apexReqData
    );
    let graphRes = await compositeGraphApi([
      {
        graphId: "1",
        compositeRequest,
      },
    ]);
    console.log(
      "graphRes---------------------------------------->",
      JSON.stringify(graphRes)
    );
    // console.log("Apex response");
    if (graphRes.graphs[0].isSuccessful && apexRes.isSuccess) {
      return apexRes;
    } else {
      return { isSuccess: false };
    }
  } catch (error) {
    console.log("Error DynamicFormOnSubmitHandler", error);
  }
};
