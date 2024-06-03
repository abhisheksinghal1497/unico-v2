import { globalConstants } from "../../../constants/globalConstants";

const mergeFieldValues = (existingValue, newValue) => {
  return newValue || existingValue;
};
const jsCoreDateCreator = (dateString) => {
  if (typeof dateString !== "string") {
    return dateString;
  } else {
    return new Date(dateString);
  }
};
const formatDate = (dateTimeString) => {
  if (!dateTimeString) return "";
  const date = dateTimeString.split(" ")[0];
  let newdate;
  // if (typeof date === 'string') {
  //console.log('Inside the dateString');

  newdate = jsCoreDateCreator(date);
  // console.log('New Date', newdate);
  // } else {
  //   newdate = new Date(date);
  // }
  // console.log('NewDate-----', newdate, typeof newdate);
  const day = newdate && newdate?.getDate().toString().padStart(2, "0");

  const month =
    newdate && (newdate?.getMonth() + 1).toString().padStart(2, "0");

  const year = newdate && newdate?.getFullYear();

  return `${year}-${month}-${day}`;
};

const mergeRecords = (groupedRecords, obj) => {
  const objectType = obj?.objectType;
  if (groupedRecords.has(objectType)) {
    obj?.records?.forEach((objRec) => {
      const existingRecord = groupedRecords.get(objectType);
      const matchingRecord = existingRecord?.records.find(
        (record) => record?.Id === objRec?.Id
      );

      if (
        matchingRecord &&
        matchingRecord?.attributes?.type !== "PDPrtcpnts__c"
      ) {
        Object.keys(objRec).forEach((field) => {
          matchingRecord[field] = mergeFieldValues(
            matchingRecord[field],
            objRec[field]
          );
        });
      } else {
        existingRecord?.records.push(objRec);
      }
    });
  } else {
    groupedRecords.set(objectType, { ...obj });
  }
};

export default async function createDynamicApexReq(formData) {
  try {
    let apexReqData = new Map();

    formData?.forEach((section, index) => {
      section?.questions?.forEach((question, sectionIndex) => {
        if (
          question.respType !==
            globalConstants.dynamicFormDataTypes.reference &&
          question.respType !== globalConstants.dynamicFormDataTypes.table &&
          question.respType !== globalConstants.dynamicFormDataTypes.file &&
          question.respType !== globalConstants.dynamicFormDataTypes.video
        ) {
          if (
            question?.overrideCnfg &&
            Object.keys(question?.overrideCnfg).length > 0
          ) {
            if (
              question?.overrideCnfg?.objectName === "PDPrtcpnts__c" &&
              question?.quesResp?.length > 0
            ) {
              mergeRecords(apexReqData, {
                objectType: question?.overrideCnfg?.objectName,
                records: question?.quesResp.map((rcValue) => {
                  return {
                    Id: question?.overrideCnfg?.recordId,
                    [question?.overrideCnfg?.field]: rcValue,
                    attributes: { type: question?.overrideCnfg?.objectName },
                  };
                }),
              });
            } else {
              if (
                question.respType === globalConstants.dynamicFormDataTypes.date
              ) {
                let formattedDate = question?.quesResp
                  ? formatDate(question?.quesResp)
                  : null;

                mergeRecords(apexReqData, {
                  objectType: question?.overrideCnfg?.objectName,
                  records: [
                    {
                      Id: question?.overrideCnfg?.recordId,
                      [question?.overrideCnfg?.field]: formattedDate,
                      attributes: {
                        type: question?.overrideCnfg?.objectName,
                      },
                    },
                  ],
                });
              } else {
                if (
                  question?.overrideCnfg?.objectName === "PDPrtcpnts__c" &&
                  question?.quesResp?.length < 1
                ) {
                  mergeRecords(apexReqData, {
                    objectType: question?.overrideCnfg?.objectName,
                    records: [
                      {
                        Id: question?.overrideCnfg?.recordId,
                        [question?.overrideCnfg?.field]: null,
                        attributes: {
                          type: question?.overrideCnfg?.objectName,
                        },
                      },
                    ],
                  });
                } else {
                  mergeRecords(apexReqData, {
                    objectType: question?.overrideCnfg?.objectName,
                    records: [
                      {
                        Id: question?.overrideCnfg?.recordId,
                        [question?.overrideCnfg?.field]: question?.quesResp,
                        attributes: {
                          type: question?.overrideCnfg?.objectName,
                        },
                      },
                    ],
                  });
                }
              }
            }
          }

          if (
            question.respType ===
            globalConstants.dynamicFormDataTypes.picklistMultiselect
          ) {
            mergeRecords(apexReqData, {
              objectType: question?.responseObj,
              records: [
                {
                  Id: question?.respId,
                  Resp__c: JSON.stringify(question?.quesResp),
                  attributes: { type: question?.responseObj },
                },
              ],
            });
          } else if (
            question.respType === globalConstants.dynamicFormDataTypes.date
          ) {
            let formattedDate = question?.quesResp
              ? formatDate(question?.quesResp)
              : null;
            mergeRecords(apexReqData, {
              objectType: question?.responseObj,
              records: [
                {
                  Id: question?.respId,
                  Resp__c: formattedDate,
                  attributes: { type: question?.responseObj },
                },
              ],
            });
          } else if (
            question.respType === globalConstants.dynamicFormDataTypes.dateTime
          ) {
            console.log("question?.quesResp".question?.quesResp);
            let formattedDate = question?.quesResp
              ? new Date(question?.quesResp).toUTCString()
              : null;
            mergeRecords(apexReqData, {
              objectType: question?.responseObj,
              records: [
                {
                  Id: question?.respId,
                  Resp__c: formattedDate,
                  attributes: { type: question?.responseObj },
                },
              ],
            });
          } else {
            mergeRecords(apexReqData, {
              objectType: question?.responseObj,
              records: [
                {
                  Id: question?.respId,
                  Resp__c: question?.quesResp,
                  attributes: { type: question?.responseObj },
                },
              ],
            });
          }
        }
        if (
          question.respType === globalConstants.dynamicFormDataTypes.reference
        ) {
          if (question?.quesConfig?.data?.length > 0) {
            mergeRecords(apexReqData, {
              objectType: question?.quesConfig?.objectName,
              records: [
                ...question?.quesConfig?.data,
                // .map((record) => {
                //   if (!record.hasOwnProperty('attributes')) {
                //     let newRecord = {
                //       ...record,
                //       // ----------added
                //       // Id: question?.quesConfig?.record?.Id,
                //       attributes: { type: question?.quesConfig?.objectName },
                //     };

                //     return newRecord;
                //   }
                //   return record;
                // }),
              ],
            });
          }
        }
        if (question.respType === globalConstants.dynamicFormDataTypes.table) {
          if (question?.quesConfig?.data?.length > 0) {
            mergeRecords(apexReqData, {
              objectType: question?.quesConfig?.objectName,
              records: [
                ...question?.quesConfig?.data.map((record) => {
                  if (!record.hasOwnProperty("attributes")) {
                    let newRecord = {
                      ...record,
                      ...(question?.recordTypeId && {
                        RecordTypeId: question.recordTypeId,
                      }),
                      attributes: { type: question?.quesConfig?.objectName },
                    };

                    return newRecord;
                  }
                  return record;
                }),
              ],
            });
          }
        }
      });
    });

    const resultArray = Array.from(apexReqData.values());
    console.log("resultArray", resultArray);
    return resultArray;
  } catch (error) {
    console.log("Error createDynamicApexReq", error);
  }
}
