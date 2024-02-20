import React from 'react';
import StepIndicator from 'react-native-step-indicator';
import { View } from 'react-native';
import { colors } from '../../colors';
import { verticalScale } from '../../../utils/matrcis';

const steps = ['Basic details', 'OTP Verification', 'Lead Converted'];
const customStyles = {
  stepIndicatorSize: 35,
  currentStepIndicatorSize: 35,
  separatorStrokeWidth: 2,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: '#0076C7',
  stepStrokeWidth: 3,
  //stepStrokeFinishedColor: '#fe7013',
  stepStrokeUnFinishedColor: '#aaaaaa',
  //separatorFinishedColor: '#fe7013',
  separatorUnFinishedColor: '#aaaaaa',
  //stepIndicatorFinishedColor: '#fe7013',
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: '#0076C7',
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: '#ffffff',
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: colors.black,
  labelSize: 13,
  currentStepLabelColor: colors.black, // basic details
};

const Stepper = ({ steps, totalSteps, currentPosition }) => {
  return (
    <View style={{ marginVertical: verticalScale(10) }}>
      <StepIndicator
        customStyles={customStyles}
        currentPosition={currentPosition}
        stepCount={totalSteps}
        labels={steps}
      />
    </View>
  );
};
export default Stepper;
