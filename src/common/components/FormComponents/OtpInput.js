import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { horizontalScale, verticalScale } from '../../../utils/matrcis';
import { colors } from '../../colors';
import customTheme from '../../colors/theme';

export default function OtpInput({
  control,
  validationProps,
  setValue,
  name,
  label,
  isVisible = true,
  isDisabled = false,
  otp,
  setOtp,
  ...rest
}) {
  if (!isVisible) {
    return null;
  }

  const inputRefs = [];

  const handleTextChange = (text, index) => {
    const newValue = otp ? otp.split('') : [];
    newValue[index] = text;
    // onChange(newValue.join(''));
    setOtp(newValue.join(''));
    if (text && index < inputRefs.length - 1) {
      inputRefs[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp?.charAt(index) && index > 0) {
      inputRefs[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.otpContainer}>
        {Array.from({ length: 6 }, (_, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs[index] = ref)}
            // label={index === 0 && label} // Show label only for the first input

            // onBlur={onBlur}
            keyboardType="numeric"
            cursorColor={colors.tertiary}
            // error={error?.message}
            disabled={isDisabled}
            onChangeText={(text) => handleTextChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            value={otp?.charAt(index) || ''}
            style={[styles.textInput, index !== 0 && styles.otpInput]}
            maxLength={1}
            {...rest}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: horizontalScale(8),
    marginVertical: verticalScale(6),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  textInput: {
    flex: 1,
    backgroundColor: customTheme.colors.textInputBackground,
  },

  otpInput: {
    marginLeft: horizontalScale(8),
  },
});
