import React from 'react';
import { StyleSheet, Modal, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { colors } from '../../colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale, verticalScale } from '../../../utils/matrcis';
import customTheme from '../../colors/theme';
const CustomAlert = ({
  visible,
  onClickYes,
  onDismiss,
  title,
  confirmBtnLabel,
  cancelBtnLabel,
  ionIconName,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onDismiss}
    >
      <View style={styles.modalContainer}>
        <View style={styles.blurBackground} />
        <View style={styles.modalContent}>
          <View style={styles.alertIcon}>
            {ionIconName && (
              <Ionicons name={ionIconName} size={38} color={colors.gray300} />
            )}
          </View>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.buttonContainer}>
            {confirmBtnLabel && (
              <Button
                mode="contained"
                onPress={onClickYes}
                textColor={colors.white}
                style={styles.button}
              >
                {confirmBtnLabel}
              </Button>
            )}
            {cancelBtnLabel && (
              <Button
                mode="outlined"
                onPress={onDismiss}
                textColor={colors.black}
                style={styles.button}
              >
                {cancelBtnLabel}
              </Button>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderRadius: 10,
    padding: moderateScale(25),
    width: '80%',
    backgroundColor: colors.bgLight,
  },
  alertIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: verticalScale(10),
  },
  title: {
    textAlign: 'center',
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: verticalScale(20),
  },
  button: {
    borderRadius: 6,
    borderColor: colors.bgDark,
  },
});

export default CustomAlert;
