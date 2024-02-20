import { StyleSheet, Text, View, Platform } from "react-native";
import React from "react";
import { horizontalScale, verticalScale } from "../../../utils/matrcis";
import { colors } from "../../colors";

const CustomCard = ({ children }) => {
  return <View style={styles.container}>{children}</View>;
};

export default CustomCard;

const styles = StyleSheet.create({
  container: {
    marginTop: verticalScale(10),
    backgroundColor: colors.bgColor,
    marginHorizontal: horizontalScale(5),
    padding: verticalScale(15),
    borderRadius: 8,
    elevation: 4,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
});
