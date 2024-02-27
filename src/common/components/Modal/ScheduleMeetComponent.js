import React, { useEffect, useState } from "react";
import { StyleSheet, Modal, View } from "react-native";
import {
  Button,
  Text,
  TextInput,
  Dialog,
  IconButton,
} from "react-native-paper";
import { colors } from "../../colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { moderateScale, verticalScale } from "../../../utils/matrcis";
import customTheme from "../../colors/theme";
import CustomDatepicker from "../FormComponents/Datepicker";
import { FormControl, component } from "../FormComponents/FormControl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const ScheduleMeetComponent = ({
  visible,
  title,
  cancelBtnLabel,
  onDismiss,
  onSave,
  watch,
  setValue,
}) => {
  const validationSchema = yup.object().shape({
    ScheduleDate: yup.string().required("Select Date and Time").nullable(),
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ScheduleDate: "",
      Notes: "",
    },
    resolver: yupResolver(validationSchema),
    mode: "all",
  });
  const onSubmit = (data) => {
    onDismiss();
    reset();
    console.log("onSubmit Function Changed", data);
    console.log("Watch Function Changed", watch());
    setValue("ScheduleDate", "");
    let schDate = watch().ScheduleDate;
    console.log("After Reset schDate", schDate);
  };

  return (
    <Dialog visible={visible} onDismiss={onDismiss}>
      <IconButton
        icon="close"
        iconColor={colors.gray300}
        size={25}
        onPress={() => {
          reset();
          onDismiss();
        }}
        style={{
          position: "absolute",
          right: -20,
          top: -40,
          borderColor: colors.gray300,
          borderWidth: 2,
          backgroundColor: "white",
        }}
      />
      <Dialog.Title>
        <Text>Schedule Meeting</Text>
      </Dialog.Title>
      <Dialog.ScrollArea>
        <FormControl
          control={control}
          watch={watch}
          required={true}
          compType={component.customdatetime}
          label="Date and Time"
          name="ScheduleDate"
          mode="datetime"
          // setValue={setValue}
        />
        <FormControl
          compType={component.textArea}
          label="Notes"
          name="Notes"
          control={control}
          watch={watch}
          setValue={setValue}
          required={false}
          // isDisabled={!editable}
        />
      </Dialog.ScrollArea>
      <Dialog.Actions>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Confirm
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderRadius: 10,
    padding: moderateScale(25),
    width: "80%",
    backgroundColor: colors.bgLight,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 2,
  },
  alertIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: verticalScale(10),
  },
  title: {
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: verticalScale(20),
  },
  button: {
    borderRadius: 6,
    borderColor: colors.bgDark,
  },
  textInput: {
    backgroundColor: customTheme.colors.textInputBackground,
  },
});

export default ScheduleMeetComponent;
