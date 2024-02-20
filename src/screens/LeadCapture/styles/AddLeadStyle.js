import { StyleSheet } from 'react-native';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/matrcis';
import customTheme from '../../../common/colors/theme';
import { colors } from '../../../common/colors';

export const addLeadStyle = StyleSheet.create({
  container: {
    flex: 1,
    // marginHorizontal: horizontalScale(5),
    paddingTop: verticalScale(5),
    backgroundColor: customTheme.colors.background,
  },
  // contentContainer: {
  //   flexGrow: 1,
  //   paddingBottom: horizontalScale(64), // Adjust this value based on your button container's height
  // },
  toggleViewContainer: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelAndSwitch: {
    // paddingVertical: verticalScale(10),
    // marginHorizontal: horizontalScale(8),
    marginLeft: horizontalScale(17),
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabelStyle: {
    fontSize: customTheme.fonts.smallText.fontSize,
    color: colors.gray250,
    fontFamily: customTheme.fonts.regularText.fontFamily,
    fontWeight: customTheme.fonts.regularText.fontWeight,
    marginRight: horizontalScale(8),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: moderateScale(10),
    // bottom: verticalScale(8),
    //paddingRight: horizontalScale(90),
  },
  cancelButton: {
    marginHorizontal: horizontalScale(4),
    fontSize: customTheme.fonts.labelLarge.fontSize,
    color: colors.black,
    fontFamily: customTheme.fonts.labelLarge.fontFamily,
    fontWeight: customTheme.fonts.labelLarge.fontWeight,
    borderRadius: 8,
    borderColor: colors.bgDark,
  },
  saveAsDraftBtnStyle: {
    marginTop: verticalScale(10),
  },
  floatingIconStyle: {
    fontSize: customTheme.fonts.labelLarge.fontSize,
    color: colors.black,
    fontFamily: customTheme.fonts.labelLarge.fontFamily,
    fontWeight: customTheme.fonts.labelLarge.fontWeight,
  },
  saveAsDraftBtn: {
    alignItems: 'flex-end',
    width: '40%',
    borderRadius: customTheme.shape.roundness,
  },
  loaderView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',

    zIndex: 999,
  },
  overlay: {
    opacity: 0.1,
  },
});
