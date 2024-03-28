import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import customTheme from '../../colors/theme';
import { Button } from 'react-native-paper';

export const NoInternet = ({ onButtonPressed }) => {
  return (
    <View style={styles.container}>
      <Icon
        name="wifi-off"
        size={100}
        color={customTheme.colors.primary}
        style={{ marginTop: 5 }}
      />
      <Text style={{ fontSize: 20 }}>No Internet</Text>
      <Button
        onPress={onButtonPressed}
        style={{ marginTop: 20 }}
        mode="contained"
      >
        Try Again
      </Button>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // fontWeight: "400",
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
