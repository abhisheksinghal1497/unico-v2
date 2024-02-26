import { StyleSheet } from "react-native";
import customTheme from "../../../../../common/colors/theme";
import { colors } from "../../../../../common/colors";


export const convertedLeadStyle = StyleSheet.create({
  convertedLabel: {
    fontSize: customTheme.fonts.labelLarge.fontSize,
    fontFamily: customTheme.fonts.labelLarge.fontFamily,
    fontWeight: customTheme.fonts.labelLarge.fontWeight,
    color: colors.secondaryText,
    padding: 6,
    width: 150,
  },
  convertedValues: {
    fontSize: customTheme.fonts.labelLarge.fontSize,
    fontFamily: customTheme.fonts.labelLarge.fontFamily,
    fontWeight: customTheme.fonts.labelLarge.fontWeight,
    color: colors.black,
    padding: 6,
    flex: 1,
  },
  convertedButton: {
    borderRadius: 6,
    alignSelf: "center",
  },
  convertedValuesForLoanId: {
    // color: 'blue',
    color: colors.black,
    // textDecorationLine: "underline",
    fontSize: customTheme.fonts.labelLarge.fontSize,
    fontFamily: customTheme.fonts.labelLarge.fontFamily,
    fontWeight: customTheme.fonts.labelLarge.fontWeight,
    padding: 6,
  },
});
