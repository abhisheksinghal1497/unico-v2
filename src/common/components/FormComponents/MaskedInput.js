import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Text } from "react-native-paper";
import { Controller } from "react-hook-form";
import { horizontalScale, verticalScale } from "../../../utils/matrcis";
import { colors } from "../../colors";
import customTheme from "../../colors/theme";

export default function CustomMaskedInput({
  control,
  validationProps,
  name,
  label,
  type,
  required = false,
  ...rest
}) {
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // ------------------View/Hide Input Data---------------
  const toggleSecureEntry = () => {
    setSecureTextEntry((prevSecureTextEntry) => !prevSecureTextEntry);
  };

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
            <TextInput
              label={
                <Text>
                  {label} {required && <Text style={styles.asterisk}>*</Text>}
                </Text>
              }
              onBlur={onBlur}
              keyboardType={type}
              error={error?.message}
              secureTextEntry={secureTextEntry}
              style={styles.textInput}
              right={
                <TextInput.Icon
                  icon={secureTextEntry ? "eye" : "eye-off"}
                  onPress={toggleSecureEntry}
                />
              }
              cursorColor={colors.tertiary}
              onChangeText={(value) => onChange(value)}
              value={value?.toString()}
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
  errorMessage: {
    color: customTheme.colors.error,
    marginTop: verticalScale(2),
  },
  textInput: {
    backgroundColor: customTheme.colors.textInputBackground,
  },
});
