import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Button from "../Components/Button";
import { ListItem } from "react-native-elements";
import CustomHeader from "../Components/header";
// import { TouchableOpacity } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/Ionicons";
const LoginScreen = ({ navigation, route }) => {
  const [database, setDatabase] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { url } = route.params;
  const { list } = route.params;
  // const list = ["asdf", "asdf", "asdf"]
  const databaseList = list.map((str, key) => {
    return { label: str, value: str };
  });
  const [items, setItems] = useState(databaseList);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
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

  const [selectedValue, setSelectedValue] = useState("");

  const handleValueChange = (value) => {
    setSelectedValue(value);
  };

  const handleLogin = () => {
    // Call server-side script to authenticate user
    // console.log(value)
    AsyncStorage.setItem("username", username);
    AsyncStorage.getItem("serverURL")
      .then((url) => {
        // console.log(url); // 'https://api.example.com'
        const server_url = `${url}/web/session/authenticate`;
        fetch(server_url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "call",
            params: {
              db: `${value}`,
              login: `${username}`,
              password: `${password}`,
              context: {},
            },
            id: 1,
          }),
        })
          .then((response) => {
            const session_id = response.headers.get("Set-Cookie");
            console.log(session_id);
            AsyncStorage.setItem("sessionId", session_id);
            return response.json();
          })
          .then((data) => {
            // Here, you can access the JSON data

            if (data.result) {
              navigation.navigate("Home");
            } else {
              alert("Invalid database name or username or password");
            }
            // Do further processing or update your React Native component state
          })
          .catch((error) => {
            // Handle any errors that occurred during the request
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: "white",
        height: "120%",
        marginTop: -dimension.height * 0.062,
      }}
    >
      <View
        style={{
          position: "absolute",
          width: dimension.width,
          marginTop: dimension.height * 0.05,
        }}
      >
        <CustomHeader
          title=""
          onBackPress={() => {
            navigation.navigate("Welcome");
          }}
        />
      </View>

      <Text
        style={{
          textAlign: "center",
          fontSize: dimension.height * 0.05,
          marginTop: dimension.height * 0.15,
        }}
      >
        Welcome Back!
      </Text>
      <Text style={{ textAlign: "center", color: "#707B81", fontSize: 20 }}>
        {" "}
        Choose Your Database AND Insert Your Login And Password{" "}
      </Text>
      <Text
        style={{
          color: "#2B2B2B",
          fontSize: 14,
          marginTop: dimension.height * 0.05,
        }}
      >
        {" "}
        Database{" "}
      </Text>

      <DropDownPicker
        style={{
          fontSize: dimension.height * 0.025,
          borderRadius: 5,
          borderColor: "#F7F7F9",
          height: dimension.height * 0.05,
          minHeight: dimension.height * 0.05,
          fontSize: dimension.height * 0.025,
          paddingHorizontal: 5,
          marginTop: dimension.height * 0.01,
          backgroundColor: "#F7F7F9",
          zIndex: 999,
        }}
        // listItemContainerStyle = {{backgroundColor : '#F7F7F9', borderColor : '#F7F7F9'}}
        placeholder="Select an database"
        // dropDownContainerStyle = {{backgroundColor : 'red'}}
        dropDownContainerStyle={{
          backgroundColor: '#F7F7F9',
          borderColor: 'skyblue',
          borderWidth : 0
        }}
        open={open}
        value={value}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        items={items}
      ></DropDownPicker>
      <Text
        style={{
          color: "#2B2B2B",
          fontSize: 14,
          marginTop: dimension.height * 0.03,
          zIndex: -3,
        }}
      >
        {" "}
        Username{" "}
      </Text>
      <TextInput
        placeholder="Enter username"
        onChangeText={setUsername}
        value={username}
        style={{
          fontSize: dimension.height * 0.02,
          borderRadius: 5,
          paddingHorizontal: 5,
          height: dimension.height * 0.05,
          backgroundColor: "#F7F7F9",
          marginTop: dimension.height * 0.01,
          zIndex: -3,
        }}
      />
      <Text
        style={{
          color: "#2B2B2B",
          fontSize: 14,
          marginTop: dimension.height * 0.03,
          zIndex: -3,
        }}
      >
        {" "}
        Password{" "}
      </Text>
      <View style={{}}>
        <TextInput
          placeholder="Enter password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!showPassword}
          style={{
            fontSize: dimension.height * 0.02,
            borderRadius: 5,
            height: dimension.height * 0.05,
            paddingHorizontal: 5,
            paddingRight: 40,
            backgroundColor: "#F7F7F9",
            marginTop: dimension.height * 0.01,
            zIndex: -3,
            position: "relative",
          }}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            marginTop: dimension.height * 0.02,
            marginLeft: dimension.width * 0.8,
          }}
          onPress={handleTogglePasswordVisibility}
        >
          <Icon
            name={!showPassword ? "eye" : "eye-off"}
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <View
        style={{
          position: "absolute",
          backgroundColor: "white",
          marginBottom: 16,
          width: dimension.width,
          alignItems: "center",

          marginTop: dimension.height * 0.9,
        }}
      >
        <Button title="Login" onPress={handleLogin} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  selectInput: {
    width: 200,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "#F7F7F9",
  },
  selectedValue: {
    marginTop: 20,
  },
});
export default LoginScreen;
