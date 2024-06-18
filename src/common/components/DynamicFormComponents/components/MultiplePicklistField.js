import getRandomNumber from '../../../../utils/GetRandomNumber';
import { FormControl, component } from '../../FormComponents/FormControl';
import React, { useEffect, useState } from 'react';
function MultiplePicklistField({
  index,
  control,
  field,
  fields,
  nestedIndexPD,
  setValue,
  getValues,
  watch,
  update,
  isSwitchOn,
  formData,
}) {
  const [showField, setShowField] = useState(true);

  const getPicklistOptions = (field) => {
    let picklistOptions = [];
    if (field?.criteriaList) {
      field?.criteriaList.forEach((crit) => {
        // let evalFieldIndex = fields.findIndex(
        //   (ques) => ques.quesId === crit.evalQues
        // );
        for (let i = 0; i < formData?.length; i++) {
          for (let j = 0; j < formData[i]?.questions.length; j++) {
            if (formData[i].questions[j]?.quesId === crit?.evalQues) {
              evalFieldIndex = j;
              evalFieldNestedIndexPD = i;
              break;
            }
          }
        }
        // console.log('evalFieldIndex', evalFieldIndex);
        if (
          crit?.dependValCri?.hasOwnProperty(
            watch(`PD.${nestedIndexPD}.questions.${evalFieldIndex}.quesResp`)
          ) &&
          evalFieldIndex !== -1
        ) {
          picklistOptions = crit?.dependValCri[
            watch(`PD.${nestedIndexPD}.questions.${evalFieldIndex}.quesResp`)
          ].map((option) => {
            return { label: option, value: option, key: option };
          });
          let isExistingPicklistOptions = picklistOptions.find(
            (listItem) =>
              listItem.value ===
              watch(`PD.${nestedIndexPD}.questions.${index}.quesResp`)
          );
          if (
            (isExistingPicklistOptions === undefined ||
              Object.keys(isExistingPicklistOptions)?.length < 1) &&
            watch(`PD.${nestedIndexPD}.questions.${index}.quesResp`)
          ) {
            // console.log("MultiPicklist");
            setValue(`PD.${nestedIndexPD}.questions.${index}.quesResp`, '');
          }
          //   console.log('picklistOptions', picklistOptions);
        }
      });
    } else {
      picklistOptions = field?.multiSelectOptions;
    }

    return picklistOptions || [];
  };

  useEffect(() => {
    if (field?.criteriaList) {
      field?.criteriaList.forEach((crit) => {
        if (crit.criVal) {
          // let evalFieldIndex = fields.findIndex(
          //   (ques) => ques.quesId === crit.evalQues
          // );
          for (let i = 0; i < formData?.length; i++) {
            for (let j = 0; j < formData[i]?.questions.length; j++) {
              if (formData[i]?.questions[j]?.quesId === crit?.evalQues) {
                evalFieldIndex = j;
                evalFieldNestedIndexPD = i;
                break;
              }
            }
          }

          if (
            crit?.criVal.includes(
              watch(`PD.${nestedIndexPD}.questions.${evalFieldIndex}.quesResp`)
            )
          ) {
            setShowField(true);
          } else {
            setValue(`PD.${nestedIndexPD}.questions.${index}.quesResp`, '');
            setShowField(false);
          }
        }
      });
    }
  }, [field, fields]);

  return (
    showField && (
      <FormControl
        compType={component.multiselect}
        control={control}
        key={`${field?.id}${index}${getRandomNumber(1, 10000)}`}
        required={field?.isReqMobile}
        isDisabled={!field?.isEditable}
        defaultValue={field?.quesResp}
        name={`PD.${nestedIndexPD}.questions.${index}.quesResp`}
        label={field?.quesTitle}
        setValue={setValue}
        getValues={getValues}
        options={getPicklistOptions(field)}
        isVisible={field?.isReqMobile ? true : !isSwitchOn}
      />
    )
  );
}
export default React.memo(MultiplePicklistField);
