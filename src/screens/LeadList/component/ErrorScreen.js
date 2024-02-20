import React from "react";
import { Text, View } from "react-native";
// import { ErrorMessage } from "../../../common/constants/ErrorConstants";
import { LeadListStyles } from "../styles/LeadListStyles";

const ErrorScreen = ({ message }) => {
  return (
    <View style={LeadListStyles.errorViewStyle}>
      <Text style={LeadListStyles.errorTextStyle}>{message}</Text>
    </View>
  );
};

export default ErrorScreen;
