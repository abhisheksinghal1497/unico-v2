import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../common/colors";

const StatusCard = ({ ApplType }) => {
  const bgColor =
    ApplType === "Applicant"
      ? colors.placeholder
      : ApplType === "Co-applicant"
      ? colors.placeholder
      : ApplType === "Guarantor"
      ? colors.placeholder
      : ApplType == "Completed"
      ? colors.success
      : ApplType == "In Progress"
      ? colors.inProgress
      : ApplType == "Initiated"
      ? colors.newStatus
      : colors.white;
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <Text style={styles.statusText}>{ApplType}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
  },
  statusText: {
    color: colors.black,
    fontSize: 8,
    fontWeight: "400",
  },
});

export default StatusCard;
