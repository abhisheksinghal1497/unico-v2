import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useFieldArray } from "react-hook-form";
import { FormControl, component } from "../FormComponents/FormControl";
import getRandomNumber from "../../../utils/GetRandomNumber";
import { Button, IconButton } from "react-native-paper";
import { getDefaultValueOfField } from "./Handlers/getDefaultValueOfField";
import CustomCard from "../CustomCard/CustomCard";
import customTheme from "../../colors/theme";
import { verticalScale } from "../../../utils/matrcis";
import Toast from "react-native-toast-message";
import IconAlert from "../BottomPopover/IconAlert";

function TableFieldsArray({
  control,
  fieldsConfig,
  setValue,
  nestedIndexPD,
  nestedIndexTable,
  isSwitchOn,
  quesField,
  quesFields,
  renderForm,
  setRenderForm,
  getValues,
  formData,
  watch,
  index,
  IsCompletedPD,
}) {
  // ------------------------------------------------------------
  const [deleteAlert, setDeleteAlert] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);

  // const [tableDataLength, setTableDataLength] = useState(0);
  //   ----------------------------------

  const [showField, setShowField] = useState(true);
  useEffect(() => {
    if (quesField?.criteriaList) {
      quesField?.criteriaList.forEach((crit) => {
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
            setValue(`PD.${nestedIndexPD}.questions.${index}.quesResp`, "");
            setShowField(false);
          }
        } else if (
          crit?.dependValCri &&
          crit?.dependValCri[fieldValue] &&
          evalFieldIndex
        ) {
          setValue(
            `PD.${nestedIndexPD}.questions.${index}.quesResp`,
            crit?.dependValCri[fieldValue].toString()
          );
          setShowField(true);
        } else {
          console.log("enter  else");
          setShowField(false);
        }
      });
    }
  }, [quesField, quesFields]);

  // console.log("showFields", showField);
  const { fields, remove, append } = useFieldArray({
    control,
    name: `PD.${nestedIndexPD}.questions.${nestedIndexTable}.quesConfig.data`,
  });
  const getPicklistOptions = (field) => {
    // console.log('Picklist Field', field);
    let picklistOptions = field?.options?.map((option) => {
      return { label: option, value: option, key: option };
    });
    return picklistOptions || [];
  };
  // --------------------------------------------
  const toggleDeleteAlert = (item, data) => {
    setSelectedIndex(item);
    setDeleteAlert(!deleteAlert);
  };

  const getTableDataLength = () => {
    let tableData = fieldsConfig?.data?.filter(
      (row) => !row?.hasOwnProperty("isDeleted")
    );
    console.log("original table data length", tableData);
    return tableData?.length || 0;
  };
  // useEffect(() => {
  //   let tableLength = getTableDataLength();
  //   setTableDataLength(tableLength);
  // }, []);
  // -----------------------------------
  const onClickYesDeleteAlert = () => {
    // remove(selectedIndex);
    let selectedData = getValues(
      `PD[${nestedIndexPD}].questions[${nestedIndexTable}].quesConfig.data[${selectedIndex}]`
    );
    // -------------------
    if (selectedData?.hasOwnProperty("Id") && selectedData?.Id) {
      setValue(
        `PD[${nestedIndexPD}].questions[${nestedIndexTable}].quesConfig.data[${selectedIndex}].isDeleted`,
        true
      );
    } else {
      remove(selectedIndex);
    }

    console.log("data", selectedData);
    // --------------------
    setDeleteAlert(!deleteAlert);
    setRenderForm(!renderForm);
    Toast.show({
      type: "success",
      text1: "Row Deleted Successfully!",
      position: "top",
    });
  };
  // -------------------------------
  const AddMoreHandler = () => {
    let emptyRow = {};
    fieldsConfig?.columns?.map((column) => {
      emptyRow[`${column?.fieldName}`] = getDefaultValueOfField(column);
    });
    append(emptyRow);
    // setRenderForm(!renderForm);
    // console.log('Empty Row', emptyRow);
  };
  // console.log('fieldsConfig', fieldsConfig);
  useEffect(() => {
    let tableDataLength = getTableDataLength();
    if (tableDataLength < 1 && quesField?.isReqMobile) {
      AddMoreHandler();
    }
  }, []);
  // ------------------Helper Fxn for set the boolean flag for hide/show the Card acc. to mandatory switch-----------------------------
  function isReqMobileTrue() {
    return quesField.quesConfig.columns.some((obj) => obj.isReqMobile === true);
  }

  function DeleteButton({ dataIndex, data }) {
    let tableDataLength = getTableDataLength();
    if (quesField.isReqMobile) {
      if (fieldsConfig.enableAddMore && tableDataLength > 1) {
        return (
          <View style={{ alignItems: "flex-end" }}>
            <IconButton
              icon="trash-can"
              key={`${getRandomNumber(1, 10000)}${dataIndex}RemoveButton`}
              iconColor={customTheme.colors.error}
              size={20}
              disabled={IsCompletedPD}
              // onPress={() => remove(dataIndex)}
              onPress={() => toggleDeleteAlert(dataIndex, data)}
            />
          </View>
        );
      } else {
        return <></>;
      }
    } else {
      if (fieldsConfig.enableAddMore) {
        return (
          <View style={{ alignItems: "flex-end" }}>
            <IconButton
              icon="trash-can"
              key={`${getRandomNumber(1, 10000)}${dataIndex}RemoveButton`}
              iconColor={customTheme.colors.error}
              size={20}
              disabled={IsCompletedPD}
              // onPress={() => remove(dataIndex)}
              onPress={() => toggleDeleteAlert(dataIndex, data)}
            />
          </View>
        );
      } else {
        return <></>;
      }
    }
  }

  const isAnyReqMobileTrue = isReqMobileTrue();
  // console.log('watch---->', fieldsConfig?.enableAddMore , quesField?.quesTitle);
  // -----------------------------------
  // console.log('fields----->', isAnyReqMobileTrue);
  return (
    <View key={`${nestedIndexTable}${getRandomNumber(1, 10000)}Table`}>
      <View key={`${nestedIndexTable}${getRandomNumber(1, 100000)}deletAlert`}>
        <IconAlert
          visible={deleteAlert}
          onClickYes={onClickYesDeleteAlert}
          onDismiss={toggleDeleteAlert}
          message={"Are you sure, You want to delete this  file?"}
          iconName="warning-outline"
        />
      </View>
      {quesField?.quesTitle && (
        <View key={`${getRandomNumber(1, 10000)}${nestedIndexTable}hdj`}>
          <Text
            style={{
              fontSize: customTheme.fonts.bodyMedium.fontSize,
              fontFamily: customTheme.fonts.bodyMedium.fontFamily,
              fontWeight: "bold",
              paddingStart: 12,
              paddingTop: 12,
            }}
          >
            {quesField?.quesTitle}
          </Text>
        </View>
      )}
      {showField &&
        fields &&
        fields.map((data, dataIndex) => {
          return (
            !data.hasOwnProperty("isDeleted") &&
            (isAnyReqMobileTrue ? true : !isSwitchOn) && (
              <CustomCard key={`${dataIndex}`}>
                {fieldsConfig?.columns?.map((field, index) => {
                  return (
                    <View key={`${dataIndex}${getRandomNumber(1, 10000)}`}>
                      {field?.type === "Text" ? (
                        <FormControl
                          compType={component.input}
                          control={control}
                          key={`${index}${data?.id}`}
                          required={field?.isReqMobile}
                          isDisabled={!field?.editable}
                          defaultValue={data[`${field?.fieldName}`]}
                          name={`PD.${nestedIndexPD}.questions.${nestedIndexTable}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                          label={field?.label}
                        />
                      ) : field?.type === "Number" ? (
                        <FormControl
                          compType={component.input}
                          control={control}
                          type="decimal-pad"
                          key={`${index}${data?.id}`}
                          required={field?.isReqMobile}
                          isDisabled={!field?.editable}
                          defaultValue={data[`${field?.fieldName}`]}
                          name={`PD.${nestedIndexPD}.questions.${nestedIndexTable}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                          label={field?.label}
                        />
                      ) : field?.type === "Currency" ? (
                        <FormControl
                          compType={component.input}
                          control={control}
                          type="numeric"
                          key={`${index}${data?.id}`}
                          required={field?.isReqMobile}
                          isDisabled={!field?.editable}
                          defaultValue={data[`${field?.fieldName}`]}
                          name={`PD.${nestedIndexPD}.questions.${nestedIndexTable}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                          label={field?.label}
                        />
                      ) : field?.type === "Phone" ? (
                        <FormControl
                          compType={component.input}
                          control={control}
                          type="numeric"
                          key={`${index}${data?.id}`}
                          required={field?.isReqMobile}
                          defaultValue={field?.quesResp}
                          name={`PD.${nestedIndexPD}.questions.${index}.quesResp`}
                          label={field?.quesTitle}
                        />
                      ) : field?.type === "Textarea" ? (
                        <FormControl
                          compType={component.textArea}
                          control={control}
                          key={`${index}${data?.id}`}
                          required={field?.isReqMobile}
                          isDisabled={!field?.editable}
                          defaultValue={data[`${field?.fieldName}`]}
                          name={`PD.${nestedIndexPD}.questions.${nestedIndexTable}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                          label={field?.label}
                        />
                      ) : field?.type === "Picklist" ? (
                        <FormControl
                          compType={component.dropdown}
                          control={control}
                          key={`${index}${data?.id}`}
                          required={field?.isReqMobile}
                          isDisabled={!field?.editable}
                          defaultValue={data[`${field?.fieldName}`]}
                          name={`PD.${nestedIndexPD}.questions.${nestedIndexTable}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                          label={field?.label}
                          setValue={setValue}
                          options={getPicklistOptions(field)}
                        />
                      ) : field?.type === "Date" ? (
                        <FormControl
                          compType={component.datetime}
                          control={control}
                          key={`${index}${data?.id}`}
                          required={field?.isReqMobile}
                          defaultValue={data[`${field?.fieldName}`]}
                          name={`PD.${nestedIndexPD}.questions.${nestedIndexTable}.quesConfig.data.${dataIndex}.${field?.fieldName}`}
                          label={field?.label}
                          setValue={setValue}
                        />
                      ) : (
                        <React.Fragment key={index} />
                      )}
                    </View>
                  );
                })}
                <View
                  key={`${getRandomNumber(1, 10000)}${dataIndex}DeleteButton`}
                >
                  <DeleteButton dataIndex={dataIndex} data={data} />
                </View>
              </CustomCard>
            )
          );
        })}
      {fieldsConfig?.enableAddMore &&
      showField &&
      (isAnyReqMobileTrue ? true : !isSwitchOn) ? (
        <View style={{ alignItems: "center" }}>
          <Button
            mode="contained"
            icon="plus-circle-outline"
            key={`${getRandomNumber(1, 10000)}AddButton`}
            onPress={AddMoreHandler}
            style={{
              marginVertical: verticalScale(10),
              borderRadius: customTheme.shape.roundness,
            }}
            disabled={IsCompletedPD}
          >
            Add Row
          </Button>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}
export default React.memo(TableFieldsArray);
