import { StyleSheet } from "react-native";
import customTheme from "../../../../../common/colors/theme";
import { colors } from "../../../../../common/colors";
import { moderateScale, verticalScale } from "../../../../../utils/matrcis";


export const otpVerificationStyle = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(5),
    backgroundColor: customTheme.colors.background,
  },
mobileContainer:{
  marginTop: verticalScale(5),
  backgroundColor: customTheme.colors.surfaceVariant,
  padding: moderateScale(10),
  borderRadius: 10,
  marginVertical: 10,
},
  BottomPopoverHeader: {
    fontSize: customTheme.fonts.titleMedium.fontSize,
    textAlign: "center",
    fontFamily:customTheme.fonts.titleMedium.fontFamily
  },

  messageContainer: {
    marginVertical: 50,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  messageText: {
    fontSize: customTheme.fonts.mediumText.fontSize,
    fontWeight: customTheme.fonts.mediumText.fontWeight,
    marginTop: verticalScale(25),
    color: colors.black,
    textAlign: "center",
  },
  button: {
    marginVertical: verticalScale(5),
  },

  resendContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: verticalScale(20),
  },

  editMobNumContainer: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: verticalScale(20),
  },

  timerLabel: {
    textAlign: "center",
    marginTop: verticalScale(15),
    fontWeight: "600",
    fontSize: 16,
  },

  dashedLineBox: {
    borderWidth: 2,
    borderColor: "#999999",
    borderStyle: "dashed",
    padding: moderateScale(8),
    marginVertical: verticalScale(12),
    width: "95%",
  },

  dashLineForMessage: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#999999",
    borderStyle: "dashed",
    padding: moderateScale(24),
    marginVertical: verticalScale(12),
    width: "95%",
  },
});
