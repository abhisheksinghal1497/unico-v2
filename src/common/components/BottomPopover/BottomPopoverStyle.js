import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "../../../utils/matrcis";
import customTheme from "../../colors/theme";
export const BottomPopoverStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },

  header: {
    backgroundColor: "white",
    paddingRight: moderateScale(8),
    paddingTop: moderateScale(8),
    alignItems: "flex-end",
  },

  touchableHeader: {
    backgroundColor: "white",
    alignSelf: "flex-end",
    marginTop: verticalScale(10),
  },
  closeIcon: {
    color: customTheme.colors.primary,
    fontSize: moderateScale(16),
    fontWeight: "normal",
  },
  content: {
    backgroundColor: "white",
    borderTopLeftRadius: moderateScale(25),
    borderTopRightRadius: moderateScale(25),
    padding: moderateScale(15),
    flex: 1,
    marginTop: verticalScale(25),
  },
});
