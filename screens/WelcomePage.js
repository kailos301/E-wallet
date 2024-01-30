import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, TextInput, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useKeepAwake } from "expo-keep-awake";

import Button from "../Components/Button";
const WelcomeScreen = ({ navigation }) => {
  useKeepAwake();

  const [url, setUrl] = useState("");
  const [databaseList, setDatabaseList] = useState([]);
  const [dimension, setDimension] = useState(Dimensions.get("window"));
  const onChange = () => {
    setDimension(Dimensions.get("window"));
  };

  const getDatabaseList = () => {
    console.log(`${url}/web/database/list`);
    fetch(`${url}/web/database/list`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "list_dbs",
        id: "1",
      }),
    })
      .then((response) => {
        // console.log(response);
        return response.json();
      })
      .then((data) => {
        const list = data.result;
        navigation.navigate("Login", { url, list });
      })
      .catch((error) => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  };
  useEffect(() => {
    Dimensions.addEventListener("change", onChange);
    return () => {
      //   Dimensions.removeEventListener('change', onChange);
    };
  });
  return (
    <View
      style={{
        padding: 20,
        flex: 1,
        backgroundColor: "white",
        height: dimension.height,
        marginTop : -dimension.height * 0.062
      }}
    >
      <Text
        style={{
          textAlign: "center",
          fontSize: dimension.height * 0.05,
          marginTop: dimension.height * 0.2,
        }}
      >
        Welcome
      </Text>
      <Text style={{ textAlign: "center", color: "#707B81", fontSize: 20 }}>
        {" "}
        Input Your Server URL To Enter To The System{" "}
      </Text>
      <Text
        style={{
          color: "#2B2B2B",
          fontSize: 14,
          marginTop: dimension.height * 0.1,
        }}
      >
        {" "}
        Enter your odoo server URL{" "}
      </Text>
      <TextInput
        placeholder="https://"
        onChangeText={(text) => setUrl(text)}
        value={url}
        style={{
          backgroundColor: "#F7F7F9",
          marginTop: dimension.height * 0.02,
          height: dimension.height * 0.05,
          fontSize: dimension.height * 0.025,
          borderRadius: 5,
          paddingHorizontal: 5,
        }}
      />
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
        <Button
          title="Start"
          onPress={() => {
            getDatabaseList();
            AsyncStorage.setItem("serverURL", url);
          }}
          style={{
            backgroundColor: "#0D6EFD",
            marginTop: dimension.height * 0.1,
          }}
        />
      </View>
    </View>
  );
};

export default WelcomeScreen;
