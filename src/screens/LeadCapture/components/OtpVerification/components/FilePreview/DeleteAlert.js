import React from "react";
import { StyleSheet } from "react-native";
import { Dialog, Portal, Button, Text } from "react-native-paper";
import { colors } from "../../../../../common/colors";

const DeleteAlert = ({ visible, onClickYes, onDismiss }) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Icon size={38} icon="progress-question" />
        <Dialog.Title style={styles.title}>
          {"Are you sure, You want to delete file?"}
        </Dialog.Title>

        <Dialog.Actions>
          <Button
            mode="outlined"
            onPress={onClickYes}
            textColor={colors.newStatus}
            style={{ borderRadius: 6, borderColor: colors.bgDark }}
          >
            Yes
          </Button>
          <Button
            mode="outlined"
            onPress={onDismiss}
            textColor={colors.newStatus}
            style={{ borderRadius: 6, borderColor: colors.bgDark }}
          >
            No
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
    fontFamily: "Inter",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DeleteAlert;
