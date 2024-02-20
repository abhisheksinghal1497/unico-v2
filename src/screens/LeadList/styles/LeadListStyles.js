import { StyleSheet } from 'react-native';
import { colors } from '../../../common/colors';
import customTheme from '../../../common/colors/theme';
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../utils/matrcis';

export const LeadListStyles = StyleSheet.create({
  container: {
    flex: 1,
    margin: moderateScale(16),
  },
  searchBar: {
    backgroundColor: colors.bgColor,
  },
  menuViewContainer: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  anchorViewContainer: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: horizontalScale(8),
    flexDirection: 'row',
    borderRadius: customTheme.shape.roundness,
    alignItems: 'center',
    backgroundColor: customTheme.colors.surfaceVariant,
  },
  statusTextStyle: {
    fontSize: customTheme.fonts.regularText.fontSize,
    color: colors.black,
    fontFamily: customTheme.fonts.regularText.fontFamily,
    fontWeight: customTheme.fonts.regularText.fontWeight,
    maxWidth: 160,
  },
  iconViewStyle: { paddingHorizontal: horizontalScale(8) },
  leadIdTextStyle: {
    fontWeight: customTheme.fonts.mediumText.fontWeight,
    fontSize: customTheme.fonts.mediumText.fontSize,
    fontFamily: customTheme.fonts.mediumText.fontFamily,
    color: colors.black,
  },
  itemViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: moderateScale(12),
  },
  leadIdView: {
    alignItems: 'flex-start',
    width: '40%',
  },
  statusView: { alignItems: 'flex-end', width: '40%' },
  errorTextStyle: {
    fontWeight: customTheme.fonts.titleMedium.fontWeight,
    fontSize: customTheme.fonts.titleMedium.fontSize,
    fontFamily: customTheme.fonts.titleMedium.fontFamily,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  errorViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingViewStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  newLeadBtn: {
    alignItems: 'flex-end',
    width: '40%',
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
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0,0,0,0.3)',

    zIndex: 999,
  },
});
