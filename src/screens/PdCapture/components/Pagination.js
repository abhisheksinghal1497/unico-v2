import { StyleSheet, Text, Animated, View, Dimensions } from 'react-native';
import React from 'react';
import { horizontalScale, verticalScale } from '../../../utils/matrcis';
import { colors } from '../../../common/colors';
import customTheme from '../../../common/colors/theme';
const { width } = Dimensions.get('screen');
const Pagination = ({ data, scrollX, index }) => {
  return (
    <View style={styles.container}>
      {data.map((section, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [12, 30, 12],
          extrapolate: 'clamp',
        });
        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: [
            colors.secondaryText,
            customTheme.colors.primary,
            colors.secondaryText,
          ],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={idx.toString()}
            style={[styles.dot, { width: dotWidth, backgroundColor }]}
          />
        );
      })}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: verticalScale(20),
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  dot: {
    width: verticalScale(12),
    height: horizontalScale(12),
    borderRadius: 6,
    marginHorizontal: horizontalScale(3),
    backgroundColor: colors.secondaryText,
  },
  dotActive: {
    backgroundColor: customTheme.colors.primary,
  },
});
