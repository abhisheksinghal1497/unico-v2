import React from 'react';
import { Platform, TouchableOpacity as AndroidTouchable } from 'react-native';
import { TouchableOpacity as IOSTouchable } from 'react-native-gesture-handler';

const Touchable = ({ children, ...props }) => {
  return Platform.OS === 'android' ? (
    <AndroidTouchable {...props}>{children}</AndroidTouchable>
  ) : (
    <IOSTouchable {...props}>{children}</IOSTouchable>
  );
};
export default Touchable;
