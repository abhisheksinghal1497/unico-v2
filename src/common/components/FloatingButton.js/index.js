import React, { useEffect, useState } from "react";
import { View, Text, Animated } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/AntDesign"; // Import your icon library
import { colors } from "../../colors";
import customTheme from "../../colors/theme";
import FloatingButtonStyle from "./FloatingButtonStyle";

const CustomFABGroup = ({
  closeFAB,
  openFloatingButton,
  handleCloseLead,
  onCancelClick,
  handleSaveAsDraft,
  currentPosition,
}) => {
  const [fadeInUp] = useState(new Animated.Value(0));

  useEffect(() => {
    if (openFloatingButton) {
      Animated.timing(fadeInUp, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeInUp, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [openFloatingButton]);

  return (
    <View style={FloatingButtonStyle.container}>
      {/* Main Floating Action Button */}
      <TouchableOpacity
        style={[
          FloatingButtonStyle.fab,
          openFloatingButton ? FloatingButtonStyle.fabOpen : null,
        ]}
        onPress={closeFAB}
      >
        <Icon
          name={openFloatingButton ? "minus" : "plus"}
          size={24}
          color={colors.tertiary}
        />
      </TouchableOpacity>
      {/* Action Buttons */}
      {openFloatingButton && (
        <Animated.View
          style={[
            FloatingButtonStyle.actionsContainer,
            {
              opacity: fadeInUp,
              transform: [
                {
                  translateY: fadeInUp.interpolate({
                    inputRange: [0, 1],
                    outputRange: [10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {/* Action Button 1 */}
          <TouchableOpacity
            style={FloatingButtonStyle.actionButton}
            onPress={onCancelClick}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={FloatingButtonStyle.actionText}>Cancel</Text>
              <View style={FloatingButtonStyle.actionFab}>
                <Icon name="close" size={20} color={colors.black} />
              </View>
            </View>
          </TouchableOpacity>

          {/* Action Button 2 */}
          {currentPosition === 0 && (
            <TouchableOpacity
              style={FloatingButtonStyle.actionButton}
              onPress={handleSaveAsDraft}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={FloatingButtonStyle.actionText}>
                  Save as Draft
                </Text>
                <View style={FloatingButtonStyle.actionFab}>
                  <Icon name="save" size={20} color={colors.black} />
                </View>
              </View>
            </TouchableOpacity>
          )}
          {/* Action Button 3 */}
          <TouchableOpacity
            style={FloatingButtonStyle.actionButton}
            onPress={() => {
              handleCloseLead(), closeFAB();
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Text style={FloatingButtonStyle.actionText}>Close Lead</Text>
              <View style={FloatingButtonStyle.actionFab}>
                <Icon
                  name="closecircle"
                  size={20}
                  color={customTheme.colors.error}
                />
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default CustomFABGroup;
