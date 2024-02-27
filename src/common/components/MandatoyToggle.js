import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { Button, Icon, Switch } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../utils/matrcis';
import customTheme from '../colors/theme';
import { colors } from '../colors';
import ModalComponent from './Modal/ScheduleMeetComponent';

const LeadActivities = ({
  id,
  onScheduleClicked,
  mobileNumber,
  onEmiCalculatorClicked,
}) => {
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  // -----Toggle handler---------
  // const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  console.log('Mobile Number', mobileNumber);

  const onCallPressed = () => {
    Linking.openURL(`tel:${mobileNumber}`);
  };
  return (
    <View style={styles.toggleViewContainer}>
      <TouchableOpacity
        disabled={id ? false : true}
        onPress={() => {
          onCallPressed();
        }}
        style={styles.labelAndSwitch}
      >
        <Ionicons
          size={25}
          name={'call-sharp'}
          color={customTheme.colors.primary}
        />
        <Text style={styles.toggleLabelStyle}>Call </Text>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={id ? false : true}
        onPress={onScheduleClicked}
        style={styles.scheduleMeeting}
      >
        <Ionicons
          size={25}
          name={'calendar-number-sharp'}
          color={customTheme.colors.primary}
        />
        <Text style={styles.toggleLabelStyle}>Schedule Meeting</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onEmiCalculatorClicked}
        style={styles.saveAsDraftBtn}
      >
        <Ionicons
          size={25}
          name={'calculator-outline'}
          color={customTheme.colors.primary}
        />
        <Text style={styles.toggleLabelStyle}>Emi Calculator</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LeadActivities;

const styles = StyleSheet.create({
  toggleViewContainer: {
    //paddingVertical: verticalScale(4),
    paddingHorizontal: horizontalScale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelAndSwitch: {
    // paddingVertical: verticalScale(10),
    // marginHorizontal: horizontalScale(8),
    marginLeft: horizontalScale(17),
    // flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabelStyle: {
    fontSize: customTheme.fonts.smallText.fontSize,
    color: colors.gray250,
    fontFamily: customTheme.fonts.regularText.fontFamily,
    fontWeight: customTheme.fonts.regularText.fontWeight,
    // marginRight: horizontalScale(8),
  },
  // buttonContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'flex-start',
  //   alignItems: 'center',
  //   padding: moderateScale(20),
  //   bottom: verticalScale(8),
  //   //paddingRight: horizontalScale(90),
  // },
  saveAsDraftBtn: {
    alignItems: 'center',
    // width: '40%',
    borderRadius: customTheme.shape.roundness,
  },
  scheduleMeeting: {
    marginLeft: horizontalScale(10),
    // flexDirection: 'row',
    alignItems: 'center',
  },
});
