import React from "react";
import Icon from "react-native-vector-icons/AntDesign";
import { View, Text } from "react-native";
import { colors } from "../../../../common/colors";
import { otpVerificationStyle } from "../styles/OtpVerificationStyle";
import { moderateScale } from "../../../../utils/matrcis";

const SuccessMessage = ({ successMessage }) => {
  return (
    <View style={otpVerificationStyle.messageContainer}>
      <View style={otpVerificationStyle.dashLineForMessage}>
      <Icon
        name="checkcircle"
        size={moderateScale(50)}
        color={colors.success}
      />
      <Text style={otpVerificationStyle.messageText}>{successMessage}</Text>
    </View>
    </View>
  );
};

export default SuccessMessage;
