import React from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { colors } from "../colors";
import customTheme from "../colors/theme";
import { verticalScale } from "../../utils/matrcis";

const ErrorScreen = ({ title, subTitle }) => {
  return (
    <>
      <View style={{ marginTop: verticalScale(20) }}>
        <Text variant="titleSmall" style={styles.errorViewStyle}>
          {title}
        </Text>
        <Text variant="labelMedium" style={styles.errorViewStyle}>
          {subTitle}
        </Text>
      </View>
    </>
  );
};

export default ErrorScreen;

const styles = StyleSheet.create({
  errorViewStyle: {
    textAlign: "center",
    marginVertical: verticalScale(2),
  },
});
