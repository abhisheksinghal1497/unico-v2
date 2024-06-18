import React from "react";
import getRandomNumber from "../../../utils/GetRandomNumber";
import { FormControl, component } from "../FormComponents/FormControl";
import { View } from "react-native";
import { useFieldArray } from "react-hook-form";
import { getDefaultValueOfField } from "./Handlers/getDefaultValueOfField";
import { useEffect } from "react";
import { Text } from "react-native-paper";
import customTheme from "../../colors/theme";
function ReferenceFields({
  fieldsConfig,
  control,
  setValue,
  nestedIndexReference,
  nestedIndexPD,
  watch,
  isSwitchOn,
  field,
}) {
  // console.log(
  //   "Watch------------------>",
  //   watch(`PD.${nestedIndexPD}.questions.${nestedIndexReference}.quesTitle`)
  // );
  //   const [fields, setFields] = useState([]);
  const { fields, remove, append } = useFieldArray({
    control,
    name: `PD.${nestedIndexPD}.questions.${nestedIndexReference}.quesConfig.data`,
  });

  useEffect(() => {
    if (fields?.length === 0) {
      let emptyRow = {};
      fieldsConfig?.columns?.map((column) => {
        emptyRow[`${column?.fieldName}`] = getDefaultValueOfField(column);
      });
      append(emptyRow);
    }
  }, [fieldsConfig]);

  //console.log("field", field);

  const getPicklistOptions = (field) => {
    // console.log('Picklist Field', field);
    let picklistOptions = field?.options?.map((option) => {
      return { label: option, value: option, key: option };
    });
    return picklistOptions || [];
  };
  return (
    <View key={nestedIndexReference}>
      <Text
        style={{
          fontSize: customTheme.fonts.bodyMedium.fontSize,
          fontFamily: customTheme.fonts.bodyMedium.fontFamily,
          fontWeight: "bold",
          paddingStart: 12,
          paddingTop: 12,
        }}
      >
        {field?.quesTitle}
      </Text>

      {fields &&
        fields.map((data, dataIndex) => {
          return fieldsConfig?.columns?.map((field, index) => {
            console.log("field----------->", field);
            return (
              <View key={`${data?.id}${index}${dataIndex}`}>
                {field?.type === "Text" ? (
                  <FormControl
                    compType={component.input}
                    control={control}
                    key={data?.id}
                    required={field?.isReqMobile}
                    isDisabled={!field?.editable}
                    // defaultValue={field.quesResp}
                    isVisible={field?.isReqMobile ? true : !isSwitchOn}
                    name={`PD.${nestedIndexPD}.questions.${nestedIndexReference}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                    label={field?.label}
                  />
                ) : field?.type === "Number" ? (
                  <FormControl
                    compType={component.input}
                    control={control}
                    type="decimal-pad"
                    key={data?.id}
                    required={field?.isReqMobile}
                    isDisabled={!field?.editable}
                    isVisible={field?.isReqMobile ? true : !isSwitchOn}
                    // defaultValue={field.quesResp}
                    name={`PD.${nestedIndexPD}.questions.${nestedIndexReference}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                    label={field?.label}
                  />
                ) : field?.type === "Currency" ? (
                  <FormControl
                    compType={component.input}
                    control={control}
                    type="numeric"
                    key={data?.id}
                    required={field?.isReqMobile}
                    isDisabled={!field?.editable}
                    isVisible={field?.isReqMobile ? true : !isSwitchOn}
                    // defaultValue={field.quesResp}
                    name={`PD.${nestedIndexPD}.questions.${nestedIndexReference}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                    label={field?.label}
                  />
                ) : field?.type === "Phone" ? (
                  <FormControl
                    compType={component.input}
                    control={control}
                    type="numeric"
                    key={data?.id}
                    isDisabled={!field?.editable}
                    required={field?.isReqMobile}
                    isVisible={field?.isReqMobile ? true : !isSwitchOn}
                    //defaultValue={field.quesResp}
                    name={`PD.${nestedIndexPD}.questions.${nestedIndexReference}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                    label={field?.label}
                  />
                ) : field?.type === "Textarea" ? (
                  <FormControl
                    compType={component.textArea}
                    control={control}
                    key={data?.id}
                    required={field?.isReqMobile}
                    isDisabled={!field?.editable}
                    isVisible={field?.isReqMobile ? true : !isSwitchOn}
                    // defaultValue={field.quesResp}
                    name={`PD.${nestedIndexPD}.questions.${nestedIndexReference}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                    label={field?.label}
                  />
                ) : field?.type === "Picklist" ? (
                  <FormControl
                    compType={component.dropdown}
                    control={control}
                    key={data?.id}
                    required={field?.isReqMobile}
                    isDisabled={!field?.editable}
                    // defaultValue={''}
                    isVisible={field?.isReqMobile ? true : !isSwitchOn}
                    name={`PD.${nestedIndexPD}.questions.${nestedIndexReference}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                    label={field?.label}
                    setValue={setValue}
                    options={getPicklistOptions(field)}
                  />
                ) : field?.type === "Date" ? (
                  <FormControl
                    compType={component.datetime}
                    control={control}
                    key={data?.id}
                    required={field?.isReqMobile}
                    isDisabled={!field?.editable}
                    isVisible={field?.isReqMobile ? true : !isSwitchOn}
                    // defaultValue={field.quesResp}
                    name={`PD.${nestedIndexPD}.questions.${nestedIndexReference}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                    label={field?.label}
                    setValue={setValue}
                  />
                ) : (
                  <></>
                )}
              </View>
            );
          });
        })}
    </View>
  );
}
export default React.memo(ReferenceFields);
