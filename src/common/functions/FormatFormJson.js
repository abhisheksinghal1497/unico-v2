import { Global } from '@jest/types';
import { globalConstants } from '../constants/globalConstants';

const checkIfContainDependent = (data, parentId) => {
  let containParent = false;
  data.forEach((sec) => {
    let secContain = sec?.questions?.forEach((q) => {
      if (q?.criteriaList && q?.criteriaList[0]?.evalQues === parentId)
        containParent = true;
    });
    //if (secContain) containParent = true;
  });
  return containParent;
};

export const FormatFormJson = (json) => {
  let newArray = [...JSON.parse(json)];
  return newArray.map((section) => {
    section.questions.forEach((question) => {
      question.containDependentFields = checkIfContainDependent(
        newArray,
        question?.quesId
      );
      if (
        question.respType === globalConstants.dynamicFormDataTypes.file ||
        question?.respType === globalConstants.dynamicFormDataTypes.video
      ) {
        if (question.quesResp) {
          console.log(' question.quesResp');
          question.quesResp = JSON.parse(question.quesResp);
          console.log(' question.quesResp', question.quesResp);
        } else {
          question.quesResp = [];
        }
      }
      if (
        question?.hasOwnProperty('quesConfig') &&
        question.quesConfig !== null
      ) {
        let config = JSON.parse(question.quesConfig);
        if (!config?.hasOwnProperty('data')) {
          config.data = [];
        }
        //       // delete question?.quesConfig
        question.quesConfig = config;
        // console.log('Question Config', question);
      }
      if (
        question?.hasOwnProperty('validationConfig') &&
        question.validationConfig !== null
      ) {
        let config = JSON.parse(question.validationConfig);
        question.validationConfig = config;
      }
      if (
        question?.hasOwnProperty('criteriaList') &&
        question?.criteriaList !== null
      ) {
        //console.log("criteria List", question?.criteriaList);
        question.criteriaList.map((crit) => {
          if (
            question?.hasOwnProperty('dependValCri') &&
            crit?.dependValCri !== null
          ) {
            crit.dependValCri = JSON.parse(crit?.dependValCri);
          }
          //   if (crit.criVal !== null) {
          //     crit.criVal = JSON.parse(crit.criVal);
          //   }
          return crit;
        });
      }

      if (
        question?.hasOwnProperty('overrideCnfg') &&
        question.overrideCnfg !== null
      ) {
        let config = JSON.parse(question.overrideCnfg);
        question.overrideCnfg = config;
      }
      if (
        question?.respType ===
        globalConstants.dynamicFormDataTypes.picklistMultiselect
      ) {
        let config = JSON.parse(question.quesResp);
        question.quesResp = config;
      }
      return question;
    });

    return section;
  });
};
