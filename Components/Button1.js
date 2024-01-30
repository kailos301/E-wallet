import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  Component,
} from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
const Button1 = ({ title, onPress }) => {
  const [dimension, setDimension] = useState(Dimensions.get("window"));
  const onChange = () => {
    setDimension(Dimensions.get("window"));
  };

  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      //   Dimensions.removeEventListener('change', onChange);
    };
  });
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.loginScreenButton,
        marginTop: dimension.height * 0.05,
        width: dimension.width - 40,
        height: dimension.height * 0.06,
        borderRadius: dimension.height * 0.015,
      }}
      // onPress={() => navigate('HomeScreen')}
      underlayColor="#fff"
    >
      <Text style={styles.loginText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  loginScreenButton: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "white",
    textAlign: "center",
    alignItems: "center",
  },
  loginText: {
    color: "black",
    textAlign: "center",
    alignItems: "center",
    lineHeight: 28,
    fontSize: 12,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
export default Button1;
