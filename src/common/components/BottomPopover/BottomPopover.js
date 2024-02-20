import React from "react";
import { Text } from "react-native-paper";
import { View, TouchableOpacity, Modal } from "react-native";
import { BottomPopoverStyle } from "./BottomPopoverStyle";

const BottomPopover = ({
  children,
  visible,
  onDismiss,
  doneIsVisible = true,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onBackdropPress={onDismiss}
      style={BottomPopoverStyle.container}
    >
      {/* <View style={BottomPopoverStyle.container}> */}
      <View style={BottomPopoverStyle.content}>
        <View style={BottomPopoverStyle.header}>
          {doneIsVisible && (
            <TouchableOpacity
              style={BottomPopoverStyle.touchableHeader}
              onPress={onDismiss}
            >
              <Text style={BottomPopoverStyle.closeIcon}>Done</Text>
            </TouchableOpacity>
          )}
        </View>

        {children}
      </View>
      {/* </View> */}
    </Modal>
  );
};

export default BottomPopover;
