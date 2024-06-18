import React from "react";
import getRandomNumber from "../../../utils/GetRandomNumber";
import { useFieldArray } from "react-hook-form";
import { View } from "react-native";
import { FormControl, component } from "../FormComponents/FormControl";
import ReferenceFields from "./ReferenceFields";
import TableFieldsArray from "./TableFieldsArray";
import { globalConstants } from "../../constants/globalConstants";
import PicklistField from "./components/PicklistField";
import TextField from "./components/TextField";
import TextAreaField from "./components/TextAreaField";
import MultiplePicklistField from "./components/MultiplePicklistField";
function FieldArrayForm({
  section,
  nestedIndexPD,
  control,
  setValue,
  getValues,
  clearErrors,
  watch,
  setRenderForm,
  renderForm,
  isSwitchOn,
  formData,
  trigger,
  IsCompletedPD,
}) {
  const { fields, remove, append, update } = useFieldArray({
    control,
    name: `PD.${nestedIndexPD}.questions`,
  });
  return (
    <View key={`${nestedIndexPD}${getRandomNumber(1, 1000000000)}`}>
      {fields?.map((field, index) => {
        switch (field.respType) {
          case globalConstants.dynamicFormDataTypes.text:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <TextField
                    index={index}
                    control={control}
                    field={field}
                    clearErrors={clearErrors}
                    type="default"
                    fields={fields}
                    nestedIndexPD={nestedIndexPD}
                    setValue={setValue}
                    watch={watch}
                    isSwitchOn={isSwitchOn}
                    formData={formData}
                    getValues={getValues}
                  />
                </View>
              )
            );
            case globalConstants.dynamicFormDataTypes.email:
              return (
                field?.visibleOnMobile && (
                  <View key={`${index}${getRandomNumber(1, 10000)}`}>
                    <TextField
                      index={index}
                      control={control}
                      field={field}
                      clearErrors={clearErrors}
                      type="default"
                      fields={fields}
                      nestedIndexPD={nestedIndexPD}
                      setValue={setValue}
                      watch={watch}
                      isSwitchOn={isSwitchOn}
                      formData={formData}
                      getValues={getValues}
                    />
                  </View>
                )
              );
          case globalConstants.dynamicFormDataTypes.dateTime:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <TextField
                    index={index}
                    control={control}
                    field={field}
                    type="default"
                    fields={fields}
                    nestedIndexPD={nestedIndexPD}
                    setValue={setValue}
                    watch={watch}
                    isSwitchOn={isSwitchOn}
                    getValues={getValues}
                    formData={formData}
                  />
                </View>
              )
            );
          case globalConstants.dynamicFormDataTypes.number:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <TextField
                    index={index}
                    control={control}
                    field={field}
                    type="numeric"
                    fields={fields}
                    nestedIndexPD={nestedIndexPD}
                    setValue={setValue}
                    watch={watch}
                    isSwitchOn={isSwitchOn}
                    getValues={getValues}
                    formData={formData}
                  />
                </View>
              )
            );
          case globalConstants.dynamicFormDataTypes.decimal:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <TextField
                    index={index}
                    control={control}
                    field={field}
                    type="decimal-pad"
                    fields={fields}
                    nestedIndexPD={nestedIndexPD}
                    setValue={setValue}
                    watch={watch}
                    isSwitchOn={isSwitchOn}
                    getValues={getValues}
                    formData={formData}
                  />
                </View>
              )
            );
          case globalConstants.dynamicFormDataTypes.phone:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <TextField
                    index={index}
                    control={control}
                    field={field}
                    fields={fields}
                    type="numeric"
                    nestedIndexPD={nestedIndexPD}
                    setValue={setValue}
                    watch={watch}
                    isSwitchOn={isSwitchOn}
                    getValues={getValues}
                    formData={formData}
                  />
                </View>
              )
            );
          case globalConstants.dynamicFormDataTypes.textarea:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <TextAreaField
                    index={index}
                    control={control}
                    field={field}
                    fields={fields}
                    nestedIndexPD={nestedIndexPD}
                    setValue={setValue}
                    watch={watch}
                    isSwitchOn={isSwitchOn}
                    getValues={getValues}
                    formData={formData}
                  />
                </View>
              )
            );
          case globalConstants.dynamicFormDataTypes.picklist:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <PicklistField
                    index={index}
                    control={control}
                    field={field}
                    fields={fields}
                    nestedIndexPD={nestedIndexPD}
                    setValue={setValue}
                    setRenderForm={setRenderForm}
                    renderForm={renderForm}
                    watch={watch}
                    clearErrors={clearErrors}
                    isSwitchOn={isSwitchOn}
                    getValues={getValues}
                    formData={formData}
                  />
                </View>
              )
            );
          case globalConstants.dynamicFormDataTypes.picklistMultiselect:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <MultiplePicklistField
                    index={index}
                    control={control}
                    field={field}
                    fields={fields}
                    nestedIndexPD={nestedIndexPD}
                    setValue={setValue}
                    watch={watch}
                    getValues={getValues}
                    isSwitchOn={isSwitchOn}
                    formData={formData}
                  />
                </View>
              )
            );

          case globalConstants.dynamicFormDataTypes.date:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <FormControl
                    compType={component.customDateSelctor}
                    isDisabled={!field.isEditable}
                    control={control}
                    key={field?.id}
                    required={field.isReqMobile}
                    defaultValue={field.quesResp}
                    name={`PD.${nestedIndexPD}.questions.${index}.quesResp`}
                    label={field.quesTitle}
                    setValue={setValue}
                    isVisible={field.isReqMobile ? true : !isSwitchOn}
                    formData={formData}
                    trigger={trigger}
                  />
                </View>
              )
            );
          case globalConstants.dynamicFormDataTypes.reference:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <ReferenceFields
                    fieldsConfig={field.quesConfig}
                    key={field?.id}
                    control={control}
                    nestedIndexReference={index}
                    nestedIndexPD={nestedIndexPD}
                    setValue={setValue}
                    watch={watch}
                    isSwitchOn={isSwitchOn}
                    field={field}
                  />
                </View>
              )
            );
          case globalConstants.dynamicFormDataTypes.table:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <TableFieldsArray
                    control={control}
                    key={field?.id}
                    fieldsConfig={field.quesConfig}
                    nestedIndexTable={index}
                    nestedIndexPD={nestedIndexPD}
                    setValue={setValue}
                    nestedIndex={index}
                    isSwitchOn={isSwitchOn}
                    quesField={field}
                    quesFields={fields}
                    renderForm={renderForm}
                    setRenderForm={setRenderForm}
                    getValues={getValues}
                    formData={formData}
                    watch={watch}
                    index={index}
                    IsCompletedPD={IsCompletedPD}
                  />
                </View>
              )
            );

          case globalConstants.dynamicFormDataTypes.file:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <FormControl
                    compType={component.photograph}
                    control={control}
                    key={field?.id}
                    required={field.isReqMobile}
                    defaultValue={field.quesResp}
                    name={`PD.${nestedIndexPD}.questions.${index}.quesResp`}
                    label={field.quesTitle}
                    setValue={setValue}
                    value={field.quesResp}
                    watch={watch}
                    field={field}
                    update={update}
                    isVisible={field?.isReqMobile ? true : !isSwitchOn}
                    nestedIndexPD={nestedIndexPD}
                    index={index}
                    fields={fields}
                  />
                </View>
              )
            );

          case globalConstants.dynamicFormDataTypes.video:
            return (
              field?.visibleOnMobile && (
                <View key={`${index}${getRandomNumber(1, 10000)}`}>
                  <FormControl
                    compType={component.video}
                    control={control}
                    key={field?.id}
                    required={field.isReqMobile}
                    defaultValue={field.quesResp}
                    name={`PD.${nestedIndexPD}.questions.${index}.quesResp`}
                    label={field.quesTitle}
                    setValue={setValue}
                    value={field.quesResp}
                    watch={watch}
                    field={field}
                    update={update}
                    isVisible={field?.isReqMobile ? true : !isSwitchOn}
                    nestedIndexPD={nestedIndexPD}
                    index={index}
                    fields={fields}
                  />
                </View>
              )
            );
          default:
            return <View key={`${index}${getRandomNumber(1, 10000)}`}></View>;
        }
      })}
    </View>
  );
}
export default React.memo(FieldArrayForm);
