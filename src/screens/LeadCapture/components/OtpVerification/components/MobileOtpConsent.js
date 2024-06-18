import { View, ActivityIndicator } from "react-native";
import { Text, Button, HelperText } from "react-native-paper";
import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/AntDesign";
import {
  FormControl,
  component,
} from "../../../../../common/components/FormComponents/FormControl";
import { useInternet } from "../../../../../store/context/Internet";
import customTheme from "../../../../../common/colors/theme";
import { otpVerificationStyle } from "../styles/OtpVerificationStyle";
import { horizontalScale, verticalScale } from "../../../../../utils/matrcis";
import {
  OTPVerificationService,
  ValidateOTPService,
} from "../../../../../services/PostRequestService/PostObjectData";
import { colors } from "../../../../../common/colors";
import { onSubmitOtp } from "../../Handlers/OtpSubmitHandler";
import { convertToDateString } from "../../../../../common/functions/ConvertToDateString";
import Touchable from "../../../../../common/components/TouchableComponent/Touchable";
import { QueryObject } from "../../../../../services/QueryObject";
import { query } from "../../../../../common/constants/Queries";
import { globalConstants } from "../../../../../common/constants/globalConstants";

const MobileOtpConsent = ({
  control,
  watch,
  LeadId,
  setValue,
  retryCounts,
  maxRetries,
  setRetryCounts,
  handleSubmit,
  expectedOtp,
  setExpectedOtp,
  otp,
  setOtp,
  setAddLoading,
  timer,
  setTimer,
  postData,
  setPostData,
  addLoading,
  isMobileNumberChanged,
  setIsMobileNumberChanged,
  coolingPeriodTimer,
  setCoolingPeriodTimer,
}) => {
  let isVerified = postData?.OTP_Verified__c;
  const enteredOTP = otp;
  useEffect(() => {
    // setExpectedOtp(null);
    setOtp("");
  }, []);
  const isOnline = useInternet();
  // --------------Timer------------------
  const [resendDisabled, setResendDisabled] = useState(false);
  const [isOtpRequested, setIsOtpRequested] = useState(false);
  // console.log();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    // console.log("remainingSeconds", remainingSeconds);
    if (remainingSeconds > 0) {
      return `Time Remaining : ${minutes}:${
        remainingSeconds < 10 ? "0" : ""
      }${parseInt(remainingSeconds)}`;
    } else {
      return null;
    }
  };

  const checkIfCoolingPeriodPassed = (date) => {
    let dateString = convertToDateString(date);

    // console.log('Date String', dateString);
    if (!dateString) {
      return true;
    }
    const dateTimeValue = new Date(dateString); // Replace this with your actual date-time value

    // Get the current date-time
    const currentDateTime = new Date();

    // Calculate the time difference in milliseconds
    const timeDifference = currentDateTime - dateTimeValue;

    // Convert milliseconds to hours
    const hoursDifference = timeDifference / (1000 * 60 * 60);
    const secondsDifference = timeDifference / 1000;

    setCoolingPeriodTimer(7200 - secondsDifference);

    // Check if the difference is more than 2 hours
    // console.log('Hours Difference', hoursDifference);
    if (hoursDifference > 2) {
      return true;
    } else {
      return false;
    }
  };

  const resetTimer = () => {
    setTimer(globalConstants.otpTimer);
  };

  // console.log('isMobileNumberChanged', isMobileNumberChanged);

  useEffect(() => {
    if (postData?.OTP_Attempts__c && postData?.OTP_Attempts__c > 0) {
      setRetryCounts(postData?.OTP_Attempts__c);

      if (isMobileNumberChanged) {
        setRetryCounts(0);
        setExpectedOtp(null);
        setOtp("");
        // setIsMobileNumberChanged(false);
        setCoolingPeriodTimer(null);
      }

      let isCoolingPeriodPassed = checkIfCoolingPeriodPassed(
        postData?.Last_OTP_Attempt_Time__c
      );

      // console.log('Is Cooling Period', isCoolingPeriodPassed);
      if (isCoolingPeriodPassed) {
        setRetryCounts(0);
        setCoolingPeriodTimer(null);
      }
    }
  }, [postData, isMobileNumberChanged]);

  // console.log('retry Counts', postData?.OTP_Attempts__c, retryCounts);

  useEffect(() => {
    setResendDisabled(timer > 0);
    if (timer <= 0 && isOtpRequested) {
      setExpectedOtp(null);
      Toast.show({
        type: "error",
        text1: "OTP Expired",
        position: "top",
      });
      setIsOtpRequested(false);
    }
  }, [timer]);

  const handleSendOTP = async () => {
    try {
      setAddLoading(true);

      let currentRetryCount = retryCounts;

      if (currentRetryCount < maxRetries) {
        await sendOTP(watch().MobilePhoneOtp, currentRetryCount + 1);
        // setIsMobileNumberChanged(false);
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Maximum Retries reached",
          position: "top",
        });
      }

      setAddLoading(false);
    } catch (error) {
      setAddLoading(false);
      console.log("error", error);
    }
  };
  // console.log('expected Otp', expectedOtp, postData, isMobileNumberChanged);
  const sendOTP = async (mobilePhone, newRetryCount) => {
    try {
      let latestRetryCount = newRetryCount;
      setIsOtpRequested(true);
      const otpRes = await OTPVerificationService(LeadId, mobilePhone);
      setIsMobileNumberChanged(false);
      // Handle OTP Response if it generated succesfully or not when integration is done
      console.log("OTP RESPONSE ______", typeof otpRes, otpRes?.message);
      if (otpRes?.error && otpRes?.error?.length > 0) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to send OTP",
          position: "top",
        });
        return;
      }
      setOtp("");

      if (otpRes?.message && otpRes?.message?.length > 0) {
        console.log("OTP Generated Successfully----");
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "OTP Generated Successfully",
          position: "top",
        });
        setExpectedOtp(otpRes?.message);
      }

      setRetryCounts(latestRetryCount);
      let currentDateTime = new Date().toISOString();
      if (watch().MobilePhone !== watch().MobilePhoneOtp) {
        setRetryCounts(1);
        latestRetryCount = 1;
        setCoolingPeriodTimer(null);
        setValue("MobilePhone", mobilePhone);
      }

      await onSubmitOtp(
        {
          ...postData,
          OTP_Attempts__c: latestRetryCount,
          OTP_Verified__c: false,
          Last_OTP_Attempt_Time__c: currentDateTime,
          Is_OTP_Limit_Reached__c: newRetryCount === maxRetries ? true : false,
          MobilePhone: mobilePhone,
          MobilePhoneOtp: mobilePhone,
          Status: "Lead Submitted - Unverified",
        },
        setPostData
      );

      resetTimer();
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleResendOTP = async () => {
    // console.log('Resend Clicked', retryCounts);

    if (!resendDisabled) {
      try {
        if (retryCounts > 2) {
          Toast.show({
            type: "error",
            text1: "OTP Limit Exceeded",
            text2: "Please try again after sometime!",
            position: "top",
          });
        } else {
          await handleSendOTP();
        }
      } catch (error) {
        setAddLoading(false);
        console.log("error", error);
      }
    }
  };

  const handleValidateOTP = async () => {
    try {
      // let res = {};
      setAddLoading(true);
      let validateRes = await ValidateOTPService(expectedOtp, enteredOTP);
      console.log(
        "Validate OTP RESPONSE_________",
        validateRes,
        validateRes?.message
      );

      if (
        validateRes &&
        validateRes?.message &&
        validateRes?.message?.length > 0
      ) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "OTP Verified Successfully",
          position: "top",
        });
        let updatedLeadData = {};
        let leadById = await QueryObject(query.getLeadByIdQuery(postData?.Id));
        updatedLeadData =
          leadById?.records?.length > 0 ? { ...leadById?.records[0] } : {};
        console.log("Updated Lead Data", updatedLeadData);
        setPostData({
          ...postData,
          OTP_Verified__c: updatedLeadData?.OTP_Verified__c,
          Status: updatedLeadData?.Status,
        });
        setExpectedOtp(null);
        setOtp("");
        setAddLoading(false);
        return;
      }

      if (validateRes && validateRes?.error && validateRes?.error?.length > 0) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Please enter a valid OTP",
          position: "top",
        });
        setAddLoading(false);
        return;
      }

      setAddLoading(false);
      //   // setValue('OTP_Verified__c', true);
      //   // isVerified = true;
      // }
      // if (otp === "") {
      //   setAddLoading(false);
      //   Toast.show({
      //     type: "error",
      //     text1: "Error",
      //     text2: "Please enter a valid OTP",
      //     position: "top",
      //   });
      //   return;
      // } else if (enteredOTP !== expectedOtp) {
      //   setAddLoading(false);
      //   Toast.show({
      //     type: "error",
      //     text1: "Error",
      //     text2: "Please enter a valid OTP",
      //     position: "top",
      //   });
      //   return;
      // }
    } catch (error) {
      setAddLoading(false);
      console.log("Error handleValidateOTP", error);
    }
  };

  const editHandler = () => {
    // if (!resendDisabled) {
    setExpectedOtp(null);
    setOtp("");
    // }
  };
  const maskingFunction = (mobileNumber) => {
    let formattedMobileNumber = "";

    const firstDigit = mobileNumber.substring(0, 1);

    const lastThreeDigits = mobileNumber.substring(7);

    return (formattedMobileNumber = `${firstDigit}XXXXXX${lastThreeDigits}`);
  };
  // -----------------------------------

  return (
    <>
      <View style={{ marginHorizontal: horizontalScale(10) }}>
        {addLoading && (
          <View style={addLeadStyle.loaderView}>
            <ActivityIndicator
              size="large"
              color={customTheme.colors.primary}
            />
          </View>
        )}
        <View style={otpVerificationStyle.mobileContainer}>
          <Text style={otpVerificationStyle.BottomPopoverHeader}>
            Mobile OTP Consent
          </Text>
        </View>
        {!expectedOtp ? (
          <>
            <View>
              <View style={{ marginTop: verticalScale(40) }}>
                <FormControl
                  compType={component.input}
                  label="Mobile No."
                  name="MobilePhoneOtp"
                  control={control}
                  required={true}
                  type="phone-pad"
                  right="phone"
                  isDisabled={isVerified || retryCounts >= maxRetries}
                />
                {isVerified && (
                  <View style={{ flexDirection: "row", padding: 12 }}>
                    <Icon
                      name="checkcircle"
                      size={20}
                      color={colors.success}
                      style={{ marginTop: 5 }}
                    />
                    <HelperText
                      type="info"
                      style={{
                        color: colors.black,
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      Mobile Number is Verified Successfully
                    </HelperText>
                  </View>
                )}
                {retryCounts &&
                retryCounts >= maxRetries &&
                !postData?.OTP_Verified__c ? (
                  <View style={{ flexDirection: "row", padding: 12 }}>
                    <Icon
                      name="closecircle"
                      size={20}
                      color={customTheme.colors.error}
                      style={{ marginTop: 5 }}
                    />

                    <HelperText
                      type="info"
                      style={{
                        color: colors.black,
                        fontWeight: "bold",
                        fontSize: 12,
                        //paddingBottom:16
                      }}
                    >
                      {`OTP Limit Reached. Please Try After ${formatTime(
                        coolingPeriodTimer
                      )} Minutes`}
                    </HelperText>
                    <Text style={otpVerificationStyle.timerLabel}></Text>
                  </View>
                ) : (
                  <></>
                )}
              </View>

              <View
                style={{
                  marginVertical: verticalScale(30),

                  alignSelf: "center",
                }}
              >
                <Button
                  mode="contained"
                  onPress={handleSubmit(handleSendOTP)}
                  disabled={
                    isOnline &&
                    ((retryCounts && retryCounts >= maxRetries) || isVerified)
                      ? true
                      : false
                  }
                >
                  Send OTP
                </Button>
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={{ marginTop: verticalScale(15) }}>
              <View style={otpVerificationStyle.editMobNumContainer}>
                <Text
                  style={{
                    fontSize: customTheme.fonts.mediumText.fontSize,

                    marginRight: 3,
                  }}
                >
                  Code sent to {maskingFunction(watch().MobilePhoneOtp)},
                </Text>

                <Text
                  style={{
                    fontSize: customTheme.fonts.mediumText.fontSize,

                    textDecorationLine: "underline",

                    color: customTheme.colors.primary,
                  }}
                  onPress={editHandler}
                >
                  Edit
                </Text>
              </View>

              <FormControl
                compType={component.otpInput}
                label="OTP"
                name="Otp__c"
                control={control}
                required={true}
                type="phone-pad"
                right="phone"
                // isDisabled={!timer}
                otp={otp}
                setOtp={setOtp}
              />

              <View
                style={{
                  marginTop: verticalScale(30),

                  alignSelf: "center",
                }}
              >
                <Button mode="contained" onPress={handleValidateOTP}>
                  Validate OTP
                </Button>
              </View>

              {/* <View style={otpVerificationStyle.resendContainer}>
                <Text
                  style={{
                    fontSize: customTheme.fonts.smallText.fontSize,

                    marginRight: 3,
                  }}
                >
                  Didn't receive the OTP?
                  
                </Text>
                <Touchable
                  onPress={handleResendOTP}
                  disabled={resendDisabled || isVerified}
                >
                  <Text
                    style={{
                      fontSize: customTheme.fonts.smallText.fontSize,
                      textDecorationLine: "underline",
                      color:
                        resendDisabled || isVerified
                          ? "gray"
                          : customTheme.colors.error,
                    }}
                  >
                    Send OTP
                  </Text>
                </Touchable>
              </View> */}

              <Text style={otpVerificationStyle.timerLabel}>
                {formatTime(timer)}
              </Text>
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default MobileOtpConsent;
