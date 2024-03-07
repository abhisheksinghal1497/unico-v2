import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import { horizontalScale, verticalScale } from '../../../utils/matrcis';
import { colors } from '../../colors';
import customTheme from '../../colors/theme';
// import Colors from '../../constants/color';

export default function ReadOnly({
  control,
  validationProps,
  name,
  label,
  type,
  right,
  initialValue,
  setValue,
  disabled = true,
  required = false,
  isVisible = true,
  ...rest
}) {
  if (!isVisible) {
    return null; // If isVisible is false, the component won't be rendered
  }
  return (
    <Controller
      control={control}
      rules={validationProps}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        return (
          <View style={styles.container}>
            <View style={styles.labelContainer}>
              <Text>
                {required && <Text style={styles.asterisk}>* </Text>}
                {label}
              </Text>
            </View>
            <TextInput
              onLayout={() => {
                // console.log("valur", value)
                value?.length < 1 && setValue(name, initialValue);
              }}
              // label={
              //   <Text>
              //     {required && <Text style={styles.asterisk}>*</Text>} {label}
              //   </Text>
              // }
              onBlur={onBlur}
              keyboardType={type}
              cursorColor={colors.tertiary}
              onChangeText={(value) => onChange(value)}
              value={value?.toString()}
              editable={false}
              disabled={disabled}
              style={styles.textInput}
              right={right && <TextInput.Icon icon={right} />}
              {...rest}
            />
            {error?.message && (
              <Text style={styles.errorMessage}>{error?.message}</Text>
            )}
          </View>
        );
      }}
      name={name}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: horizontalScale(8),
    marginVertical: verticalScale(6),
    paddingBottom: 0,
  },
  asterisk: {
    color: colors.asteriskRequired,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  errorMessage: {
    color: customTheme.colors.error,
    marginTop: verticalScale(2),
  },
  textInput: {
    backgroundColor: customTheme.colors.textInputBackground,
  },
});
