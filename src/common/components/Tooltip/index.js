import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function CustomTooltip({ title, children }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleTooltip = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.tooltipContainer}>
      <TouchableOpacity onPress={toggleTooltip} style={styles.iconContainer}>
        <Text style={styles.icon}>i</Text>
      </TouchableOpacity>
      {isVisible && <View style={styles.tooltip}>{title}</View>}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tooltipContainer: {
    position: "relative",
  },
  iconContainer: {
    position: "absolute",
    top: 0,
    right: 0,
  },
  icon: {
    fontSize: 18,
    fontWeight: "bold",
    color: "blue",
  },
  tooltip: {
    position: "absolute",
    top: 30, // Adjust the vertical position as needed
    right: 0,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1,
  },
});
