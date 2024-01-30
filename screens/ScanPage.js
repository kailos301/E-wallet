import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";

const ScannerPage = ({navigation}) => {
  const [cameraReady, setCameraReady] = useState(false);

  const handleCameraReady = () => {
    setCameraReady(true);
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onCameraReady={handleCameraReady}
      >
        {cameraReady && (
          <View style={styles.overlay}>
            <View
              style={{
                marginTop: "25%",
                shadowColor: "#AD6C48",
                shadowOffset: {
                  width: 10,
                  height: 10,
                },
                shadowOpacity: 10,
                shadowRadius: 107,
                elevation: 20,
              }}
            >
              <Image source={require("../assets/cam.png")} />
            </View>

            <View
              style={{
                backgroundColor: "white",
                width: "80%",
                height: "10%",
                marginTop: "40%",
                padding: 10,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                shadowColor: "#AD6C48",
                shadowOffset: {
                  width: 10,
                  height: 10,
                },
                shadowOpacity: 10,
                shadowRadius: 107,
                elevation: 20,
              }}
            >
              <Image
                source={require("../assets/shoe4.png")}
                style={styles.image}
              />
              <View style={{ marginLeft: 10, width: "60%" }}>
                <Text style={styles.info}>Information about the image</Text>
                <Text style={styles.info}>€154.00</Text>
              </View>
              <TouchableOpacity
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: "#5A6CF3",
                  alignItems: "center",
                  borderRadius: 8,
                }}
                onPress={() => {navigation.navigate('PriceUpdate')}}
              >
                <Image
                  source={require("../assets/edit.png")}
                  style={{ alignSelf: "center", marginTop: 5 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    // position: "absolute",
    // top: 0,
    // left: 0,
    // right: 0,
    // bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "20%",
    height: "100%",
  },
  info: {
    color: "black",
    fontSize: 12,
  },
});

export default ScannerPage;
