import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import { Controller } from 'react-hook-form';
import { horizontalScale, verticalScale } from '../../../utils/matrcis';
import { colors } from '../../colors';
import customTheme from '../../colors/theme';
import CustomTooltip from '../Tooltip';
import { IconButton, Tooltip } from 'react-native-paper';

export default function CustomInput({
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
  tooltipText = '',
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
        fieldState: { error, invalid },
      }) => {
        console.log(`Rest Props`, rest);
        return (
          <View style={styles.container}>
            <View style={styles.labelContainer}>
              <Text>
                {required && <Text style={styles.asterisk}>* </Text>}
                {label}
              </Text>

              {tooltipText && (
                <Tooltip
                  title={tooltipText}
                  enterTouchDelay={0}
                  leaveTouchDelay={1500}
                  theme={{ colors: { surface: 'white' } }}
                >
                  <IconButton
                    icon="information"
                    size={18}
                    style={{
                      alignItems: 'flex-start',
                      marginBottom: verticalScale(-6),
                    }}
                  />
                </Tooltip>
              )}
            </View>
            <TextInput
              onBlur={onBlur}
              keyboardType={type}
              cursorColor={colors.tertiary}
              returnKeyType="done"
              error={error?.message}
              scrollEnabled={false}
              //multiline={true}
              onChangeText={(value) => onChange(value)}
              value={value?.toString()}
              disabled={isDisabled}
              right={right && <TextInput.Icon icon={right} />}
              dense={true}
              style={styles.textInput}
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  asterisk: {
    color: colors.asteriskRequired,
  },
  errorMessage: {
    color: customTheme.colors.error,
    marginTop: verticalScale(2),
  },
  textInput: {
    backgroundColor: customTheme.colors.textInputBackground,
  },
});
