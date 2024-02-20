import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/matrcis';
import { colors } from '../../colors';
import customTheme from '../../colors/theme';

const inputStyles = (error) => ({
  borderColor: error ? customTheme.colors.error : colors.tertiary,
  cursorColor: error ? customTheme.colors.error : customTheme.colors.primary,
  borderBottomWidth: error ? 2 : 0.7,
});

const CustomTextArea = ({
  control,
  validationProps,
  setValue,
  name,
  label,
  type,
  right,
  isDisabled = false,
  required = false,
  isVisible = true,
  ...rest
}) => {
  if (!isVisible) {
    return null;
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
              //   label={
              //     <Text>
              //       {required && <Text style={styles.asterisk}>*</Text>}
              //       {label}
              //     </Text>
              //   }
              onBlur={onBlur}
              keyboardType={type}
              cursorColor={inputStyles(error).cursorColor}
              returnKeyType="done"
              error={error?.message}
              onChangeText={(value) => onChange(value)}
              value={value?.toString()}
              disabled={isDisabled}
              autoCapitalize="characters"
              right={right && <TextInput.Icon icon={right} />}
              multiline
              blurOnSubmit
              style={{
                backgroundColor: customTheme.colors.textInputBackground,
                minHeight: verticalScale(80),
                maxHeight: verticalScale(120),
              }}
              {...rest}
            />
            {error && <Text style={styles.errorMessage}>{error?.message}</Text>}
          </View>
        );
      }}
      name={name}
    />
  );
};

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

    textAlignVertical: 'top',

    padding: moderateScale(10),
  },
});

export default CustomTextArea;
