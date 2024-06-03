import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { useForm, useFieldArray } from "react-hook-form";
import FieldArrayForm from "./FieldArray";
import { Button } from "react-native-paper";
import getRandomNumber from "../../../utils/GetRandomNumber";
import { createValidationSchemaFromJson } from "./Validations/DynamicValidationSchema";
import * as yup from "yup";
import { moderateScale } from "../../../utils/matrcis";
import { PdListStyles } from "../../../screens/PD/styles/PdListStyles";
import { useNavigation } from "@react-navigation/native";
import MandatorySwitch from "../MandatoyToggle";
import { DynamicFormDraftHandlerPD } from "../../../screens/PdCapture/Handlers/DynamicFormDraftHandlerPD";
import Toast from "react-native-toast-message";
import { DynamicFormDraftHandlerCV } from "../../../screens/CvCapture/Handlers/DynamicFormDraftHandlerCV";
import { yupResolver } from "@hookform/resolvers/yup";
import { DynamicFormOnSubmitHandler } from "./Handlers/DynamicFormOnSubmitHandler";
import { CvFormOnSubmitHandler } from "../../../screens/CvCapture/Handlers/CvFormOnSubmitHandler";
import { getPDQuestionJson } from "../../../screens/PD/Handlers/getPDQnJson";
import { getCVQuestionJson } from "../../../screens/CvCapture/Handlers/getCVQnJson";
import { useInternet } from "../../../store/context/Internet";
import DynamicFormAccordion from "./components/DynamicFormAccordion";
import SubmitAlert from "../BottomPopover/SubmitAlert";
import { screens } from "../../constants/screen";

export default function DynamicForm({
  formData,
  Id,
  formLoading,
  renderForm,
  setRenderForm,
  IsCompleted,
  LoanApplStatus,
  onCancelButtonClicked,
  setFormLoading,
  formName,
}) {
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [submitAlert, setSubmitAlert] = useState(false);
  const [cancelAlert, setCancelAlert] = useState(false);

  const [userResponse, setUserResponse] = useState(false);
  const [liveData, setLiveData] = useState(formData);
  const [hasErrors, setHasErrors] = React.useState(false);
  const [collapseAllAccordion, setCollapseAllAccordion] = useState(true);
  const defaultValues = { PD: [] };
  const isOnline = useInternet();
  const navigation = useNavigation();

  // --------------------------------------------
  const toggleSubmitAlert = () => {
    setSubmitAlert(!submitAlert);
    setUserResponse(false);
  };
  // -----------------------------------
  const toggleCancelAlert = () => {
    setCancelAlert(!cancelAlert);
  };
  // ---------------------

  const validationSchemas =
    formData.length > 0
      ? createValidationSchemaFromJson(liveData)
      : yup.object().shape({});

  const {
    control,
    handleSubmit,
    getValues,
    setError,
    clearErrors,
    watch,
    setValue,
    trigger,
    reset,
    resetField,
    formState: { errors, isValid, isValidating },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchemas),
    mode: "all",
    shouldUnregister: false,
  });
  //console.log("Validation Error", errors);

  useEffect(() => {
    reset({ PD: formData });
  }, [formData]);

  const { fields, remove, append } = useFieldArray({
    control,
    name: `PD`,
  });

  useEffect(() => {
    const hasSectionErrors =
      errors.PD && Array.isArray(errors.PD) && errors.PD.some((item) => item);
    setHasErrors(hasSectionErrors);
  }, [fields, errors]);
  const getUpdatedQuestions = async () => {
    const getQn =
      formName === "PD"
        ? await getPDQuestionJson(Id, isOnline)
        : formName === "CV"
        ? await getCVQuestionJson(Id, isOnline)
        : {};
    console.log("getQn --------->", getQn);

    return getQn;
  };

  useEffect(() => {
    if (!collapseAllAccordion) {
      getUpdatedQuestions()
        .then((response) => {
          reset({ PD: response });
        })
        .catch((error) => console.log("error", error));
    }
  }, [collapseAllAccordion]);

  const onSaveAsDraft = async () => {
    try {
      //setSubmitAlert(!submitAlert);
      // const confirmed = await new Promise((resolve) => {
      //   setUserResponse(resolve);
      // });
      // //console.log("entered====>errors");
      // if (confirmed) {
      setFormLoading(true);

      let data = getValues();
      const res =
        formName === "PD"
          ? await DynamicFormDraftHandlerPD(data, Id)
          : formName === "CV"
          ? await DynamicFormDraftHandlerCV(data, Id)
          : {};
      if (res?.isSuccess) {
        // -----------------------------Reset----------------------
        try {
          setCollapseAllAccordion(false);
          setFormLoading(false);
        } catch (error) {
          setFormLoading(false);
        }
        // ---------------------------------------------------------
        Toast.show({
          type: "success",
          text1:
            formName === "PD"
              ? "PD Saved successfully"
              : "CV Saved successfully",
          position: "top",
        });
      } else {
        setFormLoading(false);
        Toast.show({
          type: "error",
          text1:
            formName === "PD" ? "Error in Saving PD" : "Error in Saving CV",
          position: "top",
        });
      }
    } catch (error) {
      setFormLoading(false);
      Toast.show({
        type: "error",
        text1: formName === "PD" ? "Error in Saving PD" : "Error in Saving CV",
        position: "top",
      });
      console.log("On Save as draft Error", error);
    }
  };

  const onClickYesSubmitAlert = async (data) => {
    try {
      console.log("yes its confirmed----------------->");
      setSubmitAlert(!submitAlert);
      setFormLoading(true);
      const res =
        formName === "PD"
          ? await DynamicFormOnSubmitHandler(data, Id)
          : formName === "CV"
          ? await CvFormOnSubmitHandler(data, Id)
          : {};
      setFormLoading(false);
      if (res?.isSuccess) {
        Toast.show({
          type: "success",
          text1:
            formName === "PD"
              ? "PD Submitting successfully"
              : "CV Submitting successfully",
          position: "top",
        });

        formName === "PD"
          ? navigation.navigate(screens.pdList)
          : navigation.navigate(screens.cvList);
      } else {
        Toast.show({
          type: "error",
          text1:
            formName === "PD"
              ? "Error Submitting PD"
              : "Error Submitting Collateral Visit",
          position: "top",
        });
      }
    } catch (error) {
      setFormLoading(false);
      Toast.show({
        type: "error",
        text1:
          formName === "PD"
            ? "Error Submitting PD"
            : "Error Submitting Collateral Visit",
        position: "top",
      });
      console.log("On Submit Error", error);
    }
  };
  // ---------------------------------------------
  const onClickYesCancelAlert = () => {
    setCancelAlert(!cancelAlert);
    onCancelButtonClicked();
  };
  // ---------------------------------------------
  const onSubmit = async (data) => {
    // console.log("data", data);
    // try {
    //   console.log("yes its confirmed----------------->");
    //   setFormLoading(true);
    //   const res =
    //     formName === "PD"
    //       ? await DynamicFormOnSubmitHandler(data, Id)
    //       : formName === "CV"
    //       ? await CvFormOnSubmitHandler(data, Id)
    //       : {};
    //   setFormLoading(false);
    //   if (res?.isSuccess) {
    //     Toast.show({
    //       type: "success",
    //       text1:
    //         formName === "PD"
    //           ? "PD Submitting successfully"
    //           : "CV Submitting successfully",
    //       position: "top",
    //     });

    //     formName === "PD"
    //       ? navigation.navigate(screens.pdList)
    //       : navigation.navigate(screens.cvList);
    //   } else {
    //     Toast.show({
    //       type: "error",
    //       text1:
    //         formName === "PD"
    //           ? "Error Submitting PD"
    //           : "Error Submitting Collateral Visit",
    //       position: "top",
    //     });
    //   }
    // } catch (error) {
    //   setFormLoading(false);
    //   Toast.show({
    //     type: "error",
    //     text1:
    //       formName === "PD"
    //         ? "Error Submitting PD"
    //         : "Error Submitting Collateral Visit",
    //     position: "top",
    //   });
    //   console.log("On Submit Error", error);
    // }
    setSubmitAlert(!submitAlert);
  };

  const memoizedFields = useMemo(() => {
    setLiveData(watch().PD);
    return fields.map((section, index) => {
      const isSectionTitle = section?.sectionTitle;
      const sectionErrors =
        errors.PD && Array.isArray(errors.PD) && errors.PD[index];
      const isCollapsed = hasErrors && !!sectionErrors;
      if (section?.sectionTitle) {
        return (
          <DynamicFormAccordion
            title={section.sectionTitle}
            Id={section.id}
            collapsedError={isCollapsed}
            initialState={false}
            collapseAllAccordion={collapseAllAccordion}
            setCollapseAllAccordion={setCollapseAllAccordion}
            key={`${section.sectionTitle}${index}`}
          >
            <FieldArrayForm
              section={section}
              nestedIndexPD={index}
              control={control}
              setRenderForm={setRenderForm}
              renderForm={renderForm}
              setValue={setValue}
              getValues={getValues}
              watch={watch}
              isSwitchOn={isSwitchOn}
              formData={fields}
              trigger={trigger}
            />
          </DynamicFormAccordion>
        );
      } else {
        return (
          <View key={section.id} style={{ padding: moderateScale(12) }}>
            <FieldArrayForm
              section={section}
              nestedIndexPD={index}
              control={control}
              setValue={setValue}
              setRenderForm={setRenderForm}
              renderForm={renderForm}
              getValues={getValues}
              watch={watch}
              isSwitchOn={isSwitchOn}
              formData={fields}
              trigger={trigger}
            />
          </View>
        );
      }
    });
  }, [
    fields,
    control,
    //setValue,
    //getValues,
    //watch,
    isSwitchOn,
    //trigger,
    renderForm,
    collapseAllAccordion,
    errors,
    hasErrors,
  ]);

  return (
    <View key={"Dynamic Form"} style={{ flex: 1 }}>
      <SubmitAlert
        visible={submitAlert}
        onClickYes={handleSubmit(onClickYesSubmitAlert)}
        onDismiss={toggleSubmitAlert}
        message="You wont be able to edit the details after submit. Are you sure you want to Submit ?"
        title={formName === "PD" ? "Submit PD ?" : "Submit CV ?"}
      />
      <SubmitAlert
        visible={cancelAlert}
        onClickYes={onClickYesCancelAlert}
        onDismiss={toggleCancelAlert}
        message="Are you certain you wish to cancel and return?"
        title={formName === "PD" ? "Exit PD ?" : "Exit CV ?"}
      />
      <MandatorySwitch
        isSwitchOn={isSwitchOn}
        setIsSwitchOn={setIsSwitchOn}
        IsCompleted={IsCompleted}
        LoanApplStatus={LoanApplStatus}
        onSaveAsDraft={onSaveAsDraft}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        enabled
        keyboardVerticalOffset={Platform.select({ ios: 125, android: 500 })}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {memoizedFields}
          {!formLoading && formData.length != 0 && (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                margin: moderateScale(24),
              }}
            >
              <Button
                mode={"outlined"}
                style={PdListStyles.cancelButton}
                onPress={() => setCancelAlert(!cancelAlert)}
              >
                Cancel
              </Button>
              <Button
                key={`${getRandomNumber(1, 10000)}SubmitButton`}
                mode={"contained"}
                disabled={
                  IsCompleted ||
                  LoanApplStatus === "Hold" ||
                  LoanApplStatus === "Cancelled" ||
                  LoanApplStatus === "Rejected"
                }
                style={PdListStyles.cancelButton}
                onPress={async () => {
                  try {
                    setFormLoading(true);
                    const isValid = await trigger();
                    if (!isValid) {
                      Toast.show({
                        type: "error",
                        text1: "Validation Error",
                        text2: "Please fill all the mandatory fields.",
                        position: "top",
                      });
                      return;
                    }

                    handleSubmit(onSubmit)();
                  } catch (error) {
                    console.log("Error during form submission", error);
                  } finally {
                    setFormLoading(false);
                  }
                }}
              >
                Submit
              </Button>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
