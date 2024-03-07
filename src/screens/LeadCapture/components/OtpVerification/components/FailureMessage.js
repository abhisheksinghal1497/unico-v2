import React from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { View, Text } from "react-native";
import { colors } from "../../../../common/colors";
import { otpVerificationStyle } from "../styles/OtpVerificationStyle";
import { moderateScale, verticalScale } from "../../../../utils/matrcis";
import customTheme from "../../../../common/colors/theme";

const FailureMessage = ({ FailureMessage }) => {
  return (
   
    <View style={otpVerificationStyle.messageContainer}>
       <View style = { otpVerificationStyle.dashLineForMessage}>
      <Icon
        name="closecircle"
        size={moderateScale(50)}
        color={customTheme.colors.error}
      />
      <Text style={otpVerificationStyle.messageText}>{FailureMessage}</Text>
    </View>
    </View>
  );
};

export default FailureMessage;
