import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../common/colors';

const StatusCard = ({ status }) => {
  const bgColor =
    status === 'New Lead'
      ? colors.bgLight
      : status === 'Lead Pending'
      ? colors.leadPending
      : status === 'Lead Submitted Unverified' ||
        status === 'Lead Submitted - Unverified'
      ? colors.leadSubmittedUnverified
      : status === 'Dedupe Lead'
      ? colors.dedupeLead
      : status === 'Dropped Lead'
      ? colors.droppedLead
      : status === 'Closed Lead'
      ? colors.closedLead
      : status === 'Lead Verified'
      ? colors.leadVerified
      : colors.gray200;
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <Text style={styles.statusText}>{status}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  statusText: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '400',
  },
});

export default StatusCard;
