import { MD3LightTheme as DefaultTheme } from "react-native-paper";
import { verticalScale } from "../../utils/matrcis";

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
   primary: "#0076C7",
    primaryContainer: "#B0DBF9",
    secondaryContainer: "#B0DBF9",
    surfaceVariant: "#D7E7F4",
    surface: "#0076C7",
    background: "#FFFFFF",
    textInputBackground: "#F5F5F5",
    elevation: {
      level3: "#E6F4FF",
      // level0: "#E6F4FF",
      // level1: "#E6F4FF",
      // level2: "#E6F4FF",
      // level4: "#E6F4FF",
      // level5: "#E6F4FF",
    },
  },
  shape: {
    ...DefaultTheme.shape,
    roundness: 6,
  },
  fonts: {
    ...DefaultTheme.fonts,
    smallText: {
      fontFamily: "Inter",
      fontWeight: "normal",
      fontSize: 12,
    },
    regularText: {
      fontFamily: "Inter",
      fontWeight: "normal",
      fontSize: 14,
    },
    mediumText: {
      fontFamily: "Inter",
      fontWeight: "bold",
      fontSize: 14,
    },
    default: {
      fontFamily: "Inter",
      fontWeight: "normal",
      letterSpacing: 0,
    },

    titleMedium: {
      fontFamily: "Inter",
      fontSize: 20,
      fontWeight: "400",
      letterSpacing: 0.15,
      lineHeight: 24,
    },
    titleLarge: {
      fontFamily: "Inter",
      fontSize: 22,
      fontWeight: "400",
      letterSpacing: 0,
      lineHeight: 28,
    },
    bodySmall: {
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: "400",
      letterSpacing: 0.4,
      lineHeight: 16,
    },
    labelSmall: {
      fontFamily: "Inter",
      fontSize: 11,
      fontWeight: "500",
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelMedium: {
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: "500",
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelLarge: {
      fontFamily: "Inter",
      fontSize: 14,
      fontWeight: "500",
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    headlineSmall: {
      fontFamily: "Inter",
      fontSize: 24,
      fontWeight: "400",
      letterSpacing: 0,
      lineHeight: 32,
    },
    headlineMedium: {
      fontFamily: "Inter",
      fontSize: 28,
      fontWeight: "400",
      letterSpacing: 0,
      lineHeight: 36,
    },
    headlineLarge: {
      fontFamily: "Inter",
      fontSize: 32,
      fontWeight: "400",
      letterSpacing: 0,
      lineHeight: 40,
    },
  },
  tab: {
    ...DefaultTheme.tab,
    barStyle: {
      // height: 55,
      backgroundColor: "#D7E7F4",
    },
  },
};

export default customTheme;
