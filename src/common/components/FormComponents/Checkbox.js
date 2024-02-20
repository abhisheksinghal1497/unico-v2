import React from "react";
import { Checkbox, Text } from "react-native-paper";
import { View, StyleSheet } from "react-native";
import { Controller } from "react-hook-form";
import { horizontalScale, verticalScale } from "../../../utils/matrcis";
import { colors } from "../../colors";

export default function CheckBox({
  control,
  validationProps,
  name,
  label,
  checkboxProps,
  required = false,
}) {
  const [checked, setChecked] = React.useState(false);
  return (
    <View key={label + name}>
      <Controller
        control={control}
        rules={validationProps}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => (
          <View style={styles.container}>
            <Text style={styles.label}>
              {label} {required && <Text style={styles.asterisk}>*</Text>}
            </Text>
            <Checkbox
              {...checkboxProps}
              onPress={() => {
                setChecked(!checked);
                onChange(!checked);
              }}
              status={checked ? "checked" : "unchecked"}
            />
            {/* {error.message && <Text>{error?.message}</Text>} */}
          </View>
        )}
        name={name}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginHorizontal: horizontalScale(23),
    marginVertical: verticalScale(6),
    flexDirection: "row",
  },
  label: {
    paddingTop: verticalScale(5),
    marginRight: horizontalScale(2),
  },
  asterisk: {
    color: colors.asteriskRequired,
  },
});
