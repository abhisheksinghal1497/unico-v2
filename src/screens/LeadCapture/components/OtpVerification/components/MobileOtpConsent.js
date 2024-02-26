import { View } from "react-native";
import { Text, Button, HelperText } from "react-native-paper";
import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import BackgroundTimer from "react-native-background-timer";

import Icon from "react-native-vector-icons/AntDesign";
import { FormControl, component } from "../../../../../common/components/FormComponents/FormControl";
import { useInternet } from "../../../../../store/context/Internet";
import customTheme from "../../../../../common/colors/theme";
import { otpVerificationStyle } from "../styles/OtpVerificationStyle";
import { horizontalScale, verticalScale } from "../../../../../utils/matrcis";
import { OTPVerificationService } from "../../../../../services/PostRequestService/PostObjectData";

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
  mobilePhoneCount,
  setAddLoading,
  timer,
  setTimer
}) => {
  let isVerified = false;
  const enteredOTP = otp;
  useEffect(() => {
    setExpectedOtp(null);
    setOtp("");
  }, []);
  const isOnline = useInternet();
  // --------------Timer------------------
  const [resendDisabled, setResendDisabled] = useState(false);
  const decrementTimer = () => {
    if (timer > 0) {
      setTimer(timer - 1);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 120);
    const remainingSeconds = seconds % 120;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const resetTimer = () => {
    setTimer(120);
  };

  useEffect(() => {
    const interval = BackgroundTimer.setInterval(decrementTimer, 1000);
    return () => BackgroundTimer.clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    setResendDisabled(timer > 0);
  }, [timer]);

  //---------------Handle send OTP-----------------//
  // console.log('getcounts', retryCounts);
  // const handleSendOTP = async () => {
  //   try {
  //     let getCountDetails = {};
  //     setAddLoading(true);
  //     if (retryCounts.length > 0) {
  //       getCountDetails = retryCounts.find(
  //         (value) => value.MobilePhone === watch().MobilePhone
  //       );

  //       if (getCountDetails) {
  //         let currentRetryCount = getCountDetails.retryCount;
  //         currentRetryCount < maxRetries
  //           ? await sendOTP(watch().MobilePhone, currentRetryCount + 1)
  //           : await handleMaxRetries(currentRetryCount + 1);
  //         setAddLoading(false);
  //       } else {
  //         getCountDetails = {
  //           MobilePhone: watch().MobilePhone,
  //           retryCount: 0,
  //           isVerified: false,
  //         };
  //         retryCounts.push(getCountDetails);
  //         let currentRetryCount = getCountDetails.retryCount;
  //         currentRetryCount < maxRetries
  //           ? await sendOTP(watch().MobilePhone, currentRetryCount + 1)
  //           : await handleMaxRetries(currentRetryCount + 1);
  //         setAddLoading(false);
  //       }
  //     } else {
  //       getCountDetails = {
  //         MobilePhone: watch().MobilePhone,
  //         retryCount: 0,
  //         isVerified: false,
  //       };
  //       retryCounts.push(getCountDetails);
  //       let currentRetryCount = getCountDetails.retryCount;
  //       currentRetryCount < maxRetries
  //         ? await sendOTP(watch().MobilePhone, currentRetryCount + 1)
  //         : await handleMaxRetries(currentRetryCount + 1);
  //       setAddLoading(false);
  //     }
  //   } catch (error) {
  //     setAddLoading(false);
  //     console.log("error", error);
  //   }
  // };
  // const sendOTP = async (mobilePhone, newRetryCount) => {
  //   try {
  //     console.log("LeadId----------------->", LeadId);
  //     const otpRes = await OTPVerificationService(LeadId, mobilePhone);
  //     setOtp("");
  //      console.log('otp Res', otpRes);
  //     setExpectedOtp(otpRes[0]);
  //     setRetryCounts((prevState) => {
  //       let newState = [...prevState];
  //       newState.map((value) => {
  //         if (value.MobilePhone === mobilePhone)
  //           value.retryCount = newRetryCount;
  //         return value;
  //       });
  //       return newState;
  //     });
  //     // retryCounts.set(mobilePhone, newRetryCount);
  //     setValue("Is_OTP_Limit_Reached__c", false);
  //     resetTimer();
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  // };

  // const handleMaxRetries = async (newRetryCount) => {
  //   try {
  //     let res = {};
  //     const data = {
  //       OTP_Verified__c: false,
  //       ConsentType__c: watch().ConsentType__c,
  //       Is_OTP_Limit_Reached__c: watch().Is_OTP_Limit_Reached__c,
  //       MobilePhone: watch().MobilePhone,
  //     };
  //     res = await updateObjectData("Lead", data, LeadId);
  //     // console.log(res);
  //     if (res.success) {
  //       setRetryCounts((prevState) => {
  //         let newState = [...prevState];
  //         newState.map((value) => {
  //           if (value.MobilePhone === watch().MobilePhone)
  //             value.retryCount = newRetryCount;
  //           return value;
  //         });
  //         return newState;
  //       });
  //       //setValue("Otp__c", '');
  //       setExpectedOtp(null);
  //       setOtp("");
  //       setValue("Is_OTP_Limit_Reached__c", true);
  //     }
  //     Toast.show({
  //       type: "error",
  //       text1: "Maximum Retries reached",
  //       position: "top",
  //     });
  //   } catch (error) {
  //     console.log("Error on otp limit reached", error);
  //   }
  // };
  // const handleResendOTP = async () => {
  //   if (!resendDisabled) {
  //     try {
  //       let getCountDetails = {};
  //       setAddLoading(true);
  //       getCountDetails = retryCounts.find(
  //         (value) => value.MobilePhone === watch().MobilePhone
  //       );

  //       let currentRetryCount = getCountDetails.retryCount;
  //       currentRetryCount < maxRetries
  //         ? await sendOTP(watch().MobilePhone, currentRetryCount + 1)
  //         : await handleMaxRetries(currentRetryCount + 1);
  //       setAddLoading(false);
  //     } catch (error) {
  //       setAddLoading(false);
  //       console.log("error", error);
  //     }
  //   }
  // };


  const handleSendOTP = async () => {
    try {
      setAddLoading(true);
  
      const currentRetryCount = retryCounts;
  
      if (currentRetryCount < maxRetries) {
        await sendOTP(watch().MobilePhone, currentRetryCount + 1);
      } else {
        await handleMaxRetries(currentRetryCount + 1);
      }
  
      setAddLoading(false);
    } catch (error) {
      setAddLoading(false);
      console.log("error", error);
    }
  };
  
  const sendOTP = async (mobilePhone, newRetryCount) => {
    try {
      const otpRes = await OTPVerificationService(LeadId, mobilePhone);
      setOtp("");
      setExpectedOtp(otpRes[0]);
      setRetryCounts(newRetryCount);
      setValue("Is_OTP_Limit_Reached__c", false);
      resetTimer();
    } catch (error) {
      console.log("error", error);
    }
  };
  
  const handleMaxRetries = async () => {
    try {
      const data = {
        OTP_Verified__c: false,
        Is_OTP_Limit_Reached__c: watch().Is_OTP_Limit_Reached__c,
        MobilePhone: watch().MobilePhone,
      };
      const res = await updateObjectData("Lead", data, LeadId);
  
      if (res.success) {
        // Reset the retry count in local state
        setRetryCounts(0);
        setExpectedOtp(null);
        setOtp("");
        setValue("Is_OTP_Limit_Reached__c", true);
      }
  
      Toast.show({
        type: "error",
        text1: "Maximum Retries reached",
        position: "top",
      });
    } catch (error) {
      console.log("Error on otp limit reached", error);
    }
  };
  
  const handleResendOTP = async () => {
    if (!resendDisabled) {
      try {
        setAddLoading(true);
  
      
        const currentRetryCount = retryCounts;
  
        if (currentRetryCount < maxRetries) {
          await sendOTP(watch().MobilePhone, currentRetryCount + 1);
        } else {
          await handleMaxRetries(currentRetryCount + 1);
        }
  
        setAddLoading(false);
      } catch (error) {
        setAddLoading(false);
        console.log("error", error);
      }
    }
  };



  const handleValidateOTP = async () => {
    try {
      let res = {};
      setAddLoading(true);
      if (enteredOTP === expectedOtp) {
        const data = {
          OTP_Verified__c: true,
         // ConsentType__c: watch().ConsentType__c,
          Is_OTP_Limit_Reached__c: watch().Is_OTP_Limit_Reached__c,
          MobilePhone: watch().MobilePhone,
        };
        res = await updateObjectData("Lead", data, LeadId);
        // console.log(res);
        if (res.success) {
          setAddLoading(false);
          setValue("OTP_Verified__c", true);

          // setRetryCounts((prevState) => {
          //   let newState = [...prevState];
          //   newState.map((value) => {
          //     if (value.MobilePhone === watch().MobilePhone)
          //       value.isVerified = true;
          //     return value;
          //   });
          //   return newState;
          // });
          isVerified = true;
          setExpectedOtp(null);
          setOtp("");
        }
      }
      if (otp === "") {
        setAddLoading(false);
        Toast.show({
          type: "error",
          text1: "OTP is required",
          position: "top",
        });
        return;
      } else if (enteredOTP !== expectedOtp) {
        setAddLoading(false);
        Toast.show({
          type: "error",
          text1: "Invalid OTP. Please Retry...",
          position: "top",
        });
        return;
      }
    } catch (error) {
      setAddLoading(false);
      console.log("Error handleValidateOTP", error);
    }
  };

  const editHandler = () => {
    if (!resendDisabled) {
      setExpectedOtp(null);
      setOtp("");
    }
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
                  name="MobilePhone"
                  control={control}
                  required={true}
                  type="phone-pad"
                  right="phone"
                  isDisabled={isVerified}
                />
                {isVerified && (
                  <View style={{ flexDirection: "row", padding: 12 }}>
                    <Icon name="checkcircle" size={20} color={colors.success} />
                    <HelperText
                      type="info"
                      style={{
                        color: colors.black,
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
                    >
                      Mobile Number Verified Successfully
                    </HelperText>
                  </View>
                )}
                {retryCounts &&
                retryCounts > maxRetries ? (
                  <View style={{ flexDirection: "row", padding: 12 }}>
                    <Icon name="closecircle" size={20} color={"#8B0000"} />
                    <HelperText
                      type="info"
                      style={{
                        color: colors.black,
                        fontWeight: "bold",
                        fontSize: 12,
                        //paddingBottom:16
                      }}
                    >
                      Mobile Number Not Verified. OTP Limit Reached
                    </HelperText>
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
                    isOnline
                      ? retryCounts &&
                        (retryCounts >= maxRetries ||
                          isVerified)
                      : true
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
                  Code sent to {maskingFunction(watch().MobilePhone)},
                </Text>

                <Text
                  style={{
                    fontSize: customTheme.fonts.mediumText.fontSize,

                    textDecorationLine: "underline",

                    color: resendDisabled ? "gray" : customTheme.colors.primary,
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
                  Validate
                </Button>
              </View>

              <View style={otpVerificationStyle.resendContainer}>
                <Text
                  style={{
                    fontSize: customTheme.fonts.smallText.fontSize,

                    marginRight: 3,
                  }}
                >
                  Didn't receive the OTP?
                </Text>

                <Text
                  style={{
                    fontSize: customTheme.fonts.smallText.fontSize,
                    textDecorationLine: "underline",
                    color: resendDisabled ? "gray" : customTheme.colors.error,
                  }}
                  onPress={handleResendOTP}
                >
                  Send OTP
                </Text>
              </View>

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
