import { StyleSheet } from "react-native";
import { colors } from "../../colors";
import customTheme from "../../colors/theme";
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from "../../../utils/matrcis";

const FloatingButtonStyle = StyleSheet.create({
  container: {
    position: "absolute",
    right: horizontalScale(16),
  },
  fab: {
    padding: moderateScale(16),
    backgroundColor: customTheme.colors.primaryContainer,

    borderRadius: moderateScale(15),
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    zIndex: 1,
  },

  fabOpen: {
    flex: 1,
    backgroundColor: customTheme.colors.primaryContainer, // Change to desired color when openFloatingButton
  },
  actionFab: {
    padding: moderateScale(8),
    backgroundColor: colors.bgColor,
    borderRadius: moderateScale(8),
    alignItems: "center",
    justifyContent: "center",

  },
  actionsContainer: {
    position: "absolute",
    bottom: verticalScale(50),
    right: horizontalScale(9),
    //elevation: 6,
  },
  actionButton: {
    marginBottom: verticalScale(25),
    alignItems: "flex-end",
  },
  actionText: {
    alignSelf: "center",
    textAlign: "right",
    marginRight: horizontalScale(10),
    color: colors.tertiary,
    overflow: "hidden",
    width: 100,
  },
});

export default FloatingButtonStyle;
