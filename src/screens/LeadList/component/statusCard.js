import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../../common/colors";

const StatusCard = ({ status, days }) => {
  const bgColor =
    status === "New Lead"
      ? null
      : status === "Lead Pending" && days > 90
      ? colors.leadPendingAmber
      : status === "Lead Pending"
      ? colors.leadPending
      : status === "Lead Submitted Unverified" ||
        status === "Lead Submitted - Unverified"
      ? colors.leadSubmittedUnverified
      : status === "Dedupe Lead"
      ? colors.dedupeLead
      : status === "Dropped Lead"
      ? colors.droppedLead
      : status === "Closed Lead"
      ? colors.closedLead
      : status === "Lead Verified"
      ? colors.leadVerified
      : colors.gray200;

  const updatedStatus =
    status === "Lead Pending Amber"
      ? "Lead Pending"
      : status === "Lead Submitted Unverified"
      ? "Lead Submitted - Unverified"
      : status;

  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <Text style={styles.statusText}>{updatedStatus}</Text>
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
    fontSize: 12,
    fontWeight: "400",
  },
});

export default StatusCard;
