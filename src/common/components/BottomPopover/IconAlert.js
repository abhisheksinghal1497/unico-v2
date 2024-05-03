import React from "react";
import { StyleSheet, Modal, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { colors } from "../../colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { moderateScale, verticalScale } from "../../../utils/matrcis";
import customTheme from "../../colors/theme";
const IconAlert = ({ visible, onClickYes, onDismiss,message,iconName }) => {
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
            <Ionicons
              name={iconName}
              size={38}
              color={customTheme.colors.error}
            />
          </View>
          <Text style={styles.title}>
            {message}
          </Text>
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={onClickYes}
              textColor={colors.white}
              style={styles.button}
            >
              Yes
            </Button>
            <Button
              mode="outlined"
              onPress={onDismiss}
              textColor={colors.newStatus}
              style={styles.button}
            >
              No
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderRadius: 10,
    padding: moderateScale(25),
    width: "80%",
    backgroundColor: colors.bgLight,
  },
  alertIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: verticalScale(10),
  },
  title: {
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: verticalScale(20),
  },
  button: {
    borderRadius: 6,
    borderColor: colors.bgDark,
  },
});

export default IconAlert;
