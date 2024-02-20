import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/AntDesign"; 
import { colors } from '../colors';

const CustomCheckbox = ({status,onPressCheckBox}) => {
  
    return (
      <TouchableOpacity onPress={()=>onPressCheckBox(!status)}>
        <View style={[styles.checkbox, status && styles.checked]}>
          {status &&  <Icon
          name={"check"}
          size={16}
          color={colors.black}
        />}
        </View>
       
      </TouchableOpacity>
    );
  };
  
  const styles = StyleSheet.create({
    checkbox: {
      width: 20,
      height: 20,
      borderWidth: 2,
      borderColor: colors.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checked: {
      backgroundColor: colors.bgColor,
    },
  });
  
  export default CustomCheckbox;
  