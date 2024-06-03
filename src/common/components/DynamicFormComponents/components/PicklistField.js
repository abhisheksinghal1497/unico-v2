import { debounce } from 'lodash';
import getRandomNumber from '../../../../utils/GetRandomNumber';
import { FormControl, component } from '../../FormComponents/FormControl';
import React, { useEffect, useState } from 'react';
function PicklistField({
  index,
  control,
  field,
  fields,
  nestedIndexPD,
  setRenderForm,
  renderForm,
  setValue,
  watch,
  formData,
  isSwitchOn,
  getValues,
}) {
  const [showField, setShowField] = useState(true);
  const [picklistOptions, setPicklistOptions] = useState([]);

  const getPicklistOptions = (field) => {
    let picklistOptions = [];
    if (field?.criteriaList) {
      field?.criteriaList.forEach((crit) => {
        // = fields.findIndex(
        //   (ques) => ques?.quesId === crit?.evalQues
        // );
        let evalFieldIndex;
        let evalFieldNestedIndexPD;
        for (let i = 0; i < formData?.length; i++) {
          for (let j = 0; j < formData[i]?.questions.length; j++) {
            if (formData[i].questions[j]?.quesId === crit?.evalQues) {
              evalFieldIndex = j;
              evalFieldNestedIndexPD = i;
              break;
            }
          }
        }
        if (
          crit?.dependValCri?.hasOwnProperty(
            watch(
              `PD.${evalFieldNestedIndexPD}.questions.${evalFieldIndex}.quesResp`
            )
          ) &&
          evalFieldIndex !== -1 &&
          evalFieldIndex
        ) {
          picklistOptions = crit?.dependValCri[
            watch(
              `PD.${evalFieldNestedIndexPD}.questions.${evalFieldIndex}.quesResp`
            )
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
            watch(`PD.${nestedIndexPD}.questions.${index}.quesResp`) !== ''
          ) {
            setValue(`PD.${nestedIndexPD}.questions.${index}.quesResp`, '');
          }
        } else {
          picklistOptions = field?.possibleOptions?.map((option) => {
            return { label: option, value: option, key: option };
          });
        }
      });
    } else {
      picklistOptions = field?.possibleOptions?.map((option) => {
        return { label: option, value: option, key: option };
      });
    }

    return picklistOptions || [];
  };

  const showHideFields = debounce((field) => {
    if (field?.criteriaList) {
      field?.criteriaList.forEach((crit) => {
        if (crit?.criVal) {
          // let evalFieldIndex = fields.findIndex(p
          //   (ques) => ques?.quesId === crit?.evalQues
          // );
          let evalFieldIndex;
          let evalFieldNestedIndexPD;
          for (let i = 0; i < formData?.length; i++) {
            for (let j = 0; j < formData[i]?.questions.length; j++) {
              if (formData[i].questions[j]?.quesId === crit?.evalQues) {
                evalFieldIndex = j;
                evalFieldNestedIndexPD = i;
                break;
              }
            }
          }
          if (
            crit?.criVal?.includes(
              watch(
                `PD.${evalFieldNestedIndexPD}.questions.${evalFieldIndex}.quesResp`
              )
            )
          ) {
            !showField && setShowField(true);
          } else {
            setValue(`PD.${nestedIndexPD}.questions.${index}.quesResp`, '');
            showField && setShowField(false);
          }
        }
      });
    }
  }, 500);

  useEffect(() => {
    showHideFields(field);
  }, [field]);

  useEffect(() => {
    let picklist = getPicklistOptions(field);
    setPicklistOptions(picklist);
  }, [field]);

  return (
    showField && (
      <FormControl
        compType={component.dynamicDropdown}
        control={control}
        watch={watch}
        key={field?.id}
        field={field}
        setRenderForm={setRenderForm}
        renderForm={renderForm}
        required={field?.isReqMobile}
        isDisabled={!field?.isEditable}
        defaultValue={field?.quesResp}
        name={`PD.${nestedIndexPD}.questions.${index}.quesResp`}
        label={field?.quesTitle}
        setValue={setValue}
        options={picklistOptions}
        isVisible={field?.isReqMobile ? true : !isSwitchOn}
      />
    )
  );
}

// export default React.memo(PicklistField);
export default PicklistField;
