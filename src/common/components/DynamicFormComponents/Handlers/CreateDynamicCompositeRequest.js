import { net } from "react-native-force";
import { globalConstants } from "../../../constants/globalConstants";
import { storage } from "../../../../store/MMKVStore";
export const createDynamicCompositeReq = async (data) => {
  console.log("data----->", data);
  try {
    let compositeRequest = [];
    const createCompositeRequest = data.map((section) => {
      section.questions.map((question, questionIndex) => {
        // if (
        //   question.respType !==
        //     globalConstants.dynamicFormDataTypes.reference ||
        //   question.respType !== globalConstants.dynamicFormDataTypes.table ||
        //   question.respType !== globalConstants.dynamicFormDataTypes.file
        // ) {
        //   compositeRequest.push({
        //     url: `/services/data/${net.getApiVersion()}/sobjects/PDResp__c/${
        //       question.pdRespId
        //     }/`,
        //     body: {
        //       Ques__c: question.quesTitle,
        //       Resp__c: question.quesResp,
        //       PrsnlDisc__c: section.pdId,
        //       PDQues__c: question.quesId,
        //     },
        //     method: 'PATCH',
        //     referenceId: `reference_id_upsert_${question.quesId}${questionIndex}`,
        //   });
        //   if (
        //     question?.overrideCnfg &&
        //     Object.keys(question?.overrideCnfg).length > 0
        //   ) {
        //     compositeRequest.push({
        //       url: `/services/data/${net.getApiVersion()}/sobjects/${
        //         question?.overrideCnfg.objectName
        //       }/${question?.overrideCnfg.recordId}/`,
        //       body: {
        //         [question?.overrideCnfg.field]: question.quesResp,
        //       },
        //       method: 'PATCH',
        //       referenceId: `reference_id_upsert_${question?.overrideCnfg.field}${questionIndex}`,
        //     });
        //   }
        // }
        // if (
        //   question.respType === globalConstants.dynamicFormDataTypes.reference
        // ) {
        //   question?.quesConfig?.data?.map((record, recordIndex) => {
        //     compositeRequest.push({
        //       url: `/services/data/${net.getApiVersion()}/sobjects/${
        //         question?.quesConfig?.objectName
        //       }/${question?.quesConfig?.record.Id}/`,
        //       body: {
        //         record,
        //       },
        //       method: 'PATCH',
        //       referenceId: `reference_id_upsert_${question?.quesConfig?.record.Id}_${questionIndex}_${recordIndex}`,
        //     });
        //   });
        // }
        // if (question.respType === globalConstants.dynamicFormDataTypes.table) {
        //   console.log('Table Record', question?.quesConfig?.data);
        //   question?.quesConfig?.data?.map((record, recordIndex) => {
        //     if (record.hasOwnProperty('Id')) {
        //       let recordData = question?.recordTypeId
        //         ? {
        //             ...record,
        //             RecordTypeId: question?.recordTypeId,
        //           }
        //         : { ...record };
        //       delete recordData.Id;
        //       delete recordData.attributes;
        //       compositeRequest.push({
        //         url: `/services/data/${net.getApiVersion()}/sobjects/${
        //           question?.quesConfig?.objectName
        //         }/${record.Id}/`,
        //         body: {
        //           ...recordData,
        //         },
        //         method: 'PATCH',
        //         referenceId: `reference_id_upsert_${record.Id}_${questionIndex}_${recordIndex}`,
        //       });
        //     } else {
        //       compositeRequest.push({
        //         url: `/services/data/${net.getApiVersion()}/sobjects/${
        //           question?.quesConfig?.objectName
        //         }/`,
        //         body: question?.recordTypeId
        //           ? {
        //               ...record,
        //               RecordTypeId: question?.recordTypeId,
        //             }
        //           : { ...record },
        //         method: 'POST',
        //         referenceId: `reference_id_upsert_${question?.quesConfig?.objectName}_${questionIndex}_${recordIndex}`,
        //       });
        //     }
        //   });
        // }
        if (
          question.respType === globalConstants.dynamicFormDataTypes.file ||
          question.respType === globalConstants.dynamicFormDataTypes.video
        ) {
          console.log(
            "createDynamicCompositeReq Entered the file-------------->",
            question
          );

          question.quesResp?.map((image, imageIndex) => {
            console.log("EMGData----------->", image);
            if (!image.hasOwnProperty("res")) {
              console.log("resd---------");
              compositeRequest.push({
                url: `/services/data/${net.getApiVersion()}/sobjects/ContentVersion/`,
                body: {
                  VersionData: storage.getString(image.fileName),
                  FirstPublishLocationId: question.docDetailId,
                  Title: image.fileName,
                  PathOnClient: image.fileName,
                  ContentLocation: "S",
                },
                method: "POST",
                referenceId: `reference_id_upsert_${question.docDetailId}_${questionIndex}_${imageIndex}`,
              });
            }
            //console.log("body", compositeRequest);
          });
        }
      });
    });
    console.log("Composite Request", compositeRequest);
    return compositeRequest;
  } catch (error) {
    console.log("Error createDynamicCompositeReq", error);
  }
};
