import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import Button1 from "../Components/Button1";
import { TouchableOpacity } from "react-native";
const NoResultPage = ({ navigation, route }) => {
  const [dimension, setDimension] = useState(Dimensions.get("window"));
  const onChange = () => {
    setDimension(Dimensions.get("window"));
  };
  return (
    <View
      style={{
        backgroundColor: "#FFC554",
        padding: 10,
        flex: 1,
        shadowColor: "#000000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 50,
        elevation: 20,
      }}
    >
      <Image source={require("../assets/empty.png")} style={styles.image} />
      <Image
        source={require("../assets/shadow.png")}
        style={styles.shadowImage}
      />
      <Text style={{ color: "white", textAlign: "center" }}>
        No Results found
      </Text>
      <View style={{ marginTop: "40%" }}>
        <Button1
          title="Next"
          onPress={() => navigation.navigate("New")}
          style={{
            marginTop: "30%",
          }}
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    // marginLeft : '10%',
    alignSelf: "center",
    marginTop: "30%",
    width: "60%",
    height: "50%",
    resizeMode: "contain",
  },
  shadowImage: {
    // marginLeft : '10%',
    alignSelf: "center",
    marginTop: "-20%",

    resizeMode: "contain",
  },
});

export default NoResultPage;
