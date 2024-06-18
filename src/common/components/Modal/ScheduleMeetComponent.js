import React, { useEffect, useState } from "react";
import { StyleSheet, Modal, View, ScrollView } from "react-native";
import {
  Button,
  Text,
  TextInput,
  Dialog,
  IconButton,
  Divider,
} from "react-native-paper";
import { colors } from "../../colors";
// import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale, verticalScale } from "../../../utils/matrcis";
import customTheme from "../../colors/theme";
// import CustomDatepicker from '../FormComponents/Datepicker';
import { FormControl, component } from "../FormComponents/FormControl";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { convertToDateString } from "../../functions/ConvertToDateString";
import { postObjectData } from "../../../services/PostRequestService/PostObjectData";
import Toast from "react-native-toast-message";
import { format, parse, parseISO } from "date-fns";
const ScheduleMeetComponent = ({
  visible,
  title,
  cancelBtnLabel,
  onDismiss,
  onSave,
  setAddLoading,
  leadId,
}) => {
  const validationSchema = yup.object().shape({
    Subject: yup
      .string()
      .max(50, "Input cannot be more than 50 characters")
      .required("Subject is required"),
    StartDateTime: yup
      .string()
      .required("Start Date and Time Is Required")
      .nullable(),
    EndDateTime: yup
      .string()
      .required("End Date and Time Is Required")
      .test({
        name: "conditional",
        message: "End Date and Time should be greater than Start Date and Time",
        test: function (value) {
          let dateComparison = CompareDate(this.parent.StartDateTime, value);

          if (!dateComparison) {
            // console.log('False', dateComparison);
            return false; // Channel Name is required for Connector/DSA Lead Source
          }
          // console.log('True', dateComparison);

          return true; // Validation passes if not a Connector/DSA Lead Source
        },
      })
      .nullable(),
    ReminderDateTime: yup
      .string()
      .required("Reminder Time Is Required")
      .nullable(),
  });

  const defaultValues = {
    Subject: "",
    StartDateTime: "",
    EndDateTime: "",
    Description: "",
    ReminderDateTime: "",
    IsReminderSet: true,
    WhoId: leadId,
  };

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: yupResolver(validationSchema),
    mode: "all",
  });

  const onSubmit = async (data) => {
    try {
      setAddLoading(true);
      let ReminderValue = setReminderTime(
        data.StartDateTime,
        data.ReminderDateTime
      );
      let passedStartDate = new Date(data.StartDateTime);
      let passedEndDate = new Date(data.EndDateTime);
      //  console.log('Before Convert', passedStartDate, passedEndDate);
      //  console.log(
      //    'Before Convert',
      //    typeof passedStartDate,
      //    typeof passedEndDate
      //  );

      data.ReminderDateTime = convertToDateString(ReminderValue);
      data.StartDateTime = convertToDateString(passedStartDate);
      data.EndDateTime = convertToDateString(passedEndDate);

      let res = await postObjectData("Event", data);
      if (res.success) {
        //  console.log('Success');

        Toast.show({
          type: "success",
          text1: "Meeting Scheduled Successfully",
          position: "top",
        });
        setAddLoading(false);
        reset();
      } else {
        // console.log('Error');

        Toast.show({
          type: "error",
          text1: "Something Went Wrong",
          position: "top",
        });
        setAddLoading(false);
      }
      console.log(res);

      onDismiss();
    } catch (error) {
      console.log("Error onSubmit schdeule meet component");
      setAddLoading(false);
    }
  };

  const setReminderTime = (sdate, rdate) => {
    let d = new Date(sdate);

    let timeAdded;
    switch (rdate) {
      case "15 Minutes":
        timeAdded = 15;
        break;
      case "30 Minutes":
        timeAdded = 30;
        break;
      case "1 Hour":
        timeAdded = 60;
        break;
      case "2 Hour":
        timeAdded = 120;
        break;
      default:
        break;
    }

    d.setHours(d.getHours(), d.getMinutes() - timeAdded, 0, 0);

    let passingDate = d;
    // console.log("passing Date", passingDate);
    // let passingDate = d
    // let passingDate = passedDate

    return passingDate;
  };

  const remindDateTimePicklist = [
    { label: "30 Minutes", value: "30 Minutes" },
    { label: "15 Minutes", value: "15 Minutes" },
    { label: "1 Hour", value: "1 Hour" },
    { label: "2 Hour", value: "2 Hour" },
  ];

  const CompareDate = (sDate, eDate) => {
    // console.log("sDate", sDate);
    // console.log("eDate", eDate);
    let dateString = convertToDateString(sDate);
    // console.log('Date String', dateString);
    if (!dateString) {
      return true;
    }

    const startDate = new Date(sDate);
    const endDate = new Date(eDate);

    // Calculate the time difference in milliseconds
    const timeDifference = endDate - startDate;
    // console.log("timeDifference", timeDifference);

    // Convert milliseconds to minutes
    const minutesDifference = timeDifference / (1000 * 60);
    // console.log("minutesDifference", minutesDifference);

    // Check if the difference is more than 2 minutes
    if (minutesDifference > 2) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Dialog visible={visible} onDismiss={onDismiss} style={styles.modalContainer} >
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
      <Divider />

      <ScrollView style={{ height: "50%" }}>
        <Dialog.Content>
          <FormControl
            compType={component.input}
            control={control}
            watch={watch}
            required={true}
            label="Subject"
            name="Subject"
            // setValue={setValue}
          />
          <FormControl
            control={control}
            watch={watch}
            required={true}
            compType={component.customdatetime}
            label="Start Date and Time"
            name="StartDateTime"
            mode="datetime"
            // setValue={setValue}
          />
          <FormControl
            control={control}
            watch={watch}
            required={true}
            compType={component.customdatetime}
            label="End Date and Time"
            name="EndDateTime"
            mode="datetime"
            // setValue={setValue}
          />
          <FormControl
            compType={component.textArea}
            label="Description"
            name="Description"
            control={control}
            watch={watch}
            setValue={setValue}
            required={false}
            // isDisabled={!editable}
          />
          <FormControl
            compType={component.dropdown}
            control={control}
            watch={watch}
            required={true}
            label="Remind Time Before Event"
            name="ReminderDateTime"
            options={remindDateTimePicklist}
            setValue={setValue}
          />
        </Dialog.Content>
      </ScrollView>
      <Divider />
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Confirm
        </Button>
      </View>
    </Dialog>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    height:'80%'
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
    margin: verticalScale(20),
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
