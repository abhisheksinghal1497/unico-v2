import getRandomNumber from "../../../../utils/GetRandomNumber";
import { FormControl, component } from "../../FormComponents/FormControl";
import React, { useEffect, useState } from "react";
function TextAreaField({
  index,
  control,
  field,
  fields,
  nestedIndexPD,
  setValue,
  watch,
  update,
  isSwitchOn,
  formData,
  getValues,
}) {
  const [showField, setShowField] = useState(true);
  useEffect(() => {
    if (field?.criteriaList) {
      field?.criteriaList.forEach((crit) => {
        // let evalFieldIndex = fields.findIndex(
        //   (ques) => ques?.quesId === crit?.evalQues
        // );
        let evalFieldIndex;
        let evalFieldNestedIndexPD;
        for (let i = 0; i < formData?.length; i++) {
          for (let j = 0; j < formData[i]?.questions?.length; j++) {
            if (formData[i]?.questions[j]?.quesId === crit?.evalQues) {
              evalFieldIndex = j;
              evalFieldNestedIndexPD = i;
              break;
            }
          }
        }

        let fieldValue = watch(
          `PD.${evalFieldNestedIndexPD}.questions.${evalFieldIndex}.quesResp`
        );
        if (crit?.criVal) {
          if (
            crit?.criVal.includes(fieldValue) &&
            crit?.evalQues ===
              getValues(
                `PD.${evalFieldNestedIndexPD}.questions.${evalFieldIndex}.quesId`
              )
          ) {
            setShowField(true);
          } else {
            // watch(`PD.${nestedIndexPD}.questions.${index}.quesResp`) &&
            setValue(`PD.${nestedIndexPD}.questions.${index}.quesResp`, "");
            setShowField(false);
          }
        } else if (crit?.dependValCri && evalFieldIndex) {
          const dependentValue = JSON.parse(crit?.dependValCri);
          setValue(
            `PD.${nestedIndexPD}.questions.${index}.quesResp`,
            dependentValue[fieldValue]
              ? dependentValue[fieldValue].toString()
              : ""
          );
          // setShowField(true);
        }
        // else {
        //   console.log("enter  else");
        //   setShowField(false);
        // }
      });
    }
  }, [field, fields]);

  return (
    showField && (
      <FormControl
        compType={component.textArea}
        isDisabled={!field?.isEditable}
        control={control}
        key={field?.id}
        required={field?.isReqMobile}
        defaultValue={field?.quesResp}
        name={`PD.${nestedIndexPD}.questions.${index}.quesResp`}
        label={field?.quesTitle}
        isVisible={field?.isReqMobile ? true : !isSwitchOn}
      />
    )
  );
}
export default React.memo(TextAreaField);
