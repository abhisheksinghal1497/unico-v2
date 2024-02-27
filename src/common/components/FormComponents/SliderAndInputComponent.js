import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Text } from "react-native-paper";
import { Controller } from "react-hook-form";
import { horizontalScale, verticalScale } from "../../../utils/matrcis";
import { colors } from "../../colors";
import customTheme from "../../colors/theme";
import CustomTooltip from "../Tooltip";
import { IconButton, Tooltip } from "react-native-paper";
import Slider from "@react-native-community/slider";

export default function SliderAndInputComponent({
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
  tooltipText = "",
  placeholder,
  maxValue,
  minValue,
  steps,
  minimumSliderValue,
  maximumSliderValue,
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
        // console.log(`${name} error`, error);
        return (
          <View style={styles.container}>
            <View style={styles.labelContainer}>
              <Text>
                {required && <Text style={styles.asterisk}>* </Text>}
                {label}
              </Text>
            </View>
            <Slider
              step={steps}
              style={{
                width: "100%",
                height: 30,
                padding: 0,
                margin: 0,
              }}
              value={parseFloat(value)}
              minimumValue={minimumSliderValue}
              maximumValue={maximumSliderValue}
              minimumTrackTintColor={customTheme.colors.primary}
              maximumTrackTintColor="#000000"
              thumbTintColor={customTheme.colors.primary}
              onValueChange={onChange}
            />
            <View style={styles.sliderTextWrapper}>
              <Text style={{ fontSize: 12 }}>{minValue}</Text>

              <Text style={{ fontSize: 12 }}>{maxValue}</Text>
            </View>
            <TextInput
              onBlur={onBlur}
              keyboardType={type}
              cursorColor={colors.tertiary}
              returnKeyType="done"
              error={error?.message}
              scrollEnabled={false}
              autoCapitalize={type === "decimal-pad" ? "" : "characters"}
              //multiline={true}
              onChangeText={(value) => onChange(value)}
              value={value?.toString()}
              disabled={isDisabled}
              right={right && <TextInput.Icon icon={right} />}
              dense={true}
              style={styles.textInput}
              placeholder={placeholder}
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
    flexDirection: "row",
    alignItems: "flex-end",
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
  sliderTextWrapper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
  },
  sliderText: {},
});
