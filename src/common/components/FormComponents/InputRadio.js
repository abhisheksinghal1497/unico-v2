import React from "react";

import { RadioButton, Text } from "react-native-paper";

import { View, StyleSheet } from "react-native";

import { Controller } from "react-hook-form";

import { horizontalScale, verticalScale } from "../../../utils/matrcis";

import { colors } from "../../colors";

export default function InputRadio({
  control,

  validationProps,

  name,

  label,

  options,
  isDisabled = false,
  defaultValue,
}) {
  const [selectedValue, setSelectedValue] = React.useState(
    defaultValue || options[0].value
  );

  return (
    <View>
      <Controller
        control={control}
        rules={validationProps}
        render={({
          field: { onChange, onBlur, value },

          fieldState: { error },
        }) => (
          <View style={styles.container}>
            {options?.map((option, index) => (
              <View style={styles.radioContainer} key={option.value}>
                <RadioButton
                  value={option.value}
                  disabled={isDisabled}
                  status={
                    selectedValue === option.value ? "checked" : "unchecked"
                  }
                  onPress={() => {
                    setSelectedValue(option?.value);

                    onChange(option?.value);
                  }}
                />

                <Text
                  style={styles.label}
                  onPress={() => {
                    setSelectedValue(option?.value);

                    onChange(option?.value);
                  }}
                >
                  {option?.label}
                </Text>
              </View>
            ))}

            {error && <Text>{error?.message}</Text>}
          </View>
        )}
        name={name}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: horizontalScale(10),

    marginVertical: verticalScale(6),
  },

  radioContainer: {
    flexDirection: "row",
  },

  label: {
    paddingTop: verticalScale(5),

    marginLeft: horizontalScale(2),
  },

  asterisk: {
    color: colors.asteriskRequired,
  },
});
