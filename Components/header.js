import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
const CustomHeader = ({ title, onBackPress, onFunctionPress, iconName }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Icon name="chevron-back-outline" size={24} color="#333" />
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity onPress={onFunctionPress} style={styles.newButton}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Icon name={iconName} size={24} color="#333" />
        </View>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
    height: 60,
    justifyContent: "space-around",
    alignItems: "center",
  },
  backButton: {
    marginRight: 100,
    width: 60,
    height: 60,
    // backgroundColor: "#F7F7F9",
    borderRadius: 30,
    alignItems: "center",
  },
  newButton: {
    marginLeft: 100,
    width: 60,
    height: 60,
    // backgroundColor: "#F7F7F9",
    borderRadius: 30,
    alignItems: "center",
  },
  title: {
    fontSize: 16,
  },
});

export default CustomHeader;
