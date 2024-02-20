import * as React from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const Loading = () => (
  <ActivityIndicator style={styles.spinnerStyle} animating={true} />
);

export default Loading;
const styles = StyleSheet.create({
  spinnerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
