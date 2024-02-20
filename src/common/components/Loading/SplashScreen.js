import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import customTheme from '../../colors/theme';
import { Avatar } from 'react-native-paper';

const SplashScreen = () => (
  <View style={styles.container}>
    <Image
      source={require('../../../assets/Logo_PNG.png')}
      //   size={150}
      resizeMode="contain"
      style={styles.img}
    />
  </View>
);

export default SplashScreen;
const styles = StyleSheet.create({
  container: {
    backgroundColor: customTheme.colors.background,
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  //   spinnerStyle: {},
  img: {
    width: 200,
    height: 200,
    borderRadius: 2,
  },
});
