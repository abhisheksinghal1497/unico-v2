import { StyleSheet } from "react-native";
import { colors } from "../../../common/colors";
import customTheme from "../../../common/colors/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../utils/matrcis";

export const PdListStyles = StyleSheet.create({
  container: {
    flex: 1,
    margin: moderateScale(16),
  },
  searchBar: {
    backgroundColor: colors.bgColor,
  },
  menuViewContainer: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(8),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  anchorViewContainer: {
    paddingVertical: verticalScale(8),
    paddingHorizontal: horizontalScale(15),
    flexDirection: "row",
    borderRadius: customTheme.shape.roundness,
    alignItems: "center",
    width: horizontalScale(80),
    backgroundColor: customTheme.colors.surfaceVariant,
  },
  statusTextStyle: {
    fontSize: customTheme.fonts.regularText.fontSize,
    color: colors.black,
    marginVertical: verticalScale(3),
    fontFamily: customTheme.fonts.regularText.fontFamily,
    fontWeight: customTheme.fonts.regularText.fontWeight,
    // maxWidth: horizontalScale(180),
  },
  iconViewStyle: { paddingHorizontal: horizontalScale(8) },
  pdIdTextStyle: {
    fontWeight: customTheme.fonts.mediumText.fontWeight,
    fontSize: customTheme.fonts.mediumText.fontSize,
    fontFamily: customTheme.fonts.mediumText.fontFamily,
    color: colors.black,
    maxWidth: horizontalScale(180),
  },
  pdItemViewContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: verticalScale(12),
    alignItems: "center",
  },
  itemViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkBox: {
    paddingStart: horizontalScale(12),
  },
  pdIdView: {
    alignItems: "flex-start",
    width: "45%",
  },
  statusView: { alignItems: "flex-end", width: "35%" },
  errorTextStyle: {
    fontWeight: customTheme.fonts.titleMedium.fontWeight,
    fontSize: customTheme.fonts.titleMedium.fontSize,
    fontFamily: customTheme.fonts.titleMedium.fontFamily,
    color: colors.secondaryText,
    textAlign: "center",
  },
  errorViewStyle: {
    flex: 1,
    justifyContent: "center",
  },
  loadingViewStyle: {
    flex: 1,
    justifyContent: "center",
  },
  cacheOfflineBtn: {
    alignItems: "flex-end",
    width: "40%",
  },
  button: {
    borderRadius: customTheme.shape.roundness,
    // width: horizontalScale(120),
  },
  scrollContainer: {
    maxHeight: verticalScale(300), // Set the maximum height for the scrollable list
  },

  itemSeparator: { backgroundColor: colors.bgColor, height: verticalScale(1) },
  loaderView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: 'rgba(0,0,0,0.3)',

    zIndex: 999,
  },
  cancelButton: {
    marginRight: horizontalScale(16),
    fontSize: customTheme.fonts.labelLarge.fontSize,
    color: colors.black,
    fontFamily: customTheme.fonts.labelLarge.fontFamily,
    fontWeight: customTheme.fonts.labelLarge.fontWeight,
    borderRadius: 8,
    borderColor: colors.bgDark,
  },

  radioContainer: {
    flexDirection: "row",
  },

  radioLabel: {
    paddingTop: verticalScale(5),

    marginLeft: horizontalScale(2),
  },
});
