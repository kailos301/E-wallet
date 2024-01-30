import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { useIsFocused, useScrollToTop } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import Button from "../Components/Button";
import CustomHeader from "../Components/header";
import { AntDesign } from "@expo/vector-icons";
const ProductScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [flag, setFlag] = useState(false);
  const [scanData, setScanData] = useState("");
  const [previousScreen, setPreviousScreen] = useState("Product");
  const [serverUrl, setServerUrl] = useState("");
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

  const isFocused = useIsFocused();

  useEffect(() => {
    // Call only when screen open or when back on screen
    if (searchQuery != "") {
      getProductData();
    }
  }, [isFocused]);

  const [products, setProducts] = useState([]);
  AsyncStorage.getItem("serverURL").then((url) => {
    setServerUrl(url);
  });
  const handleSearch = (text) => {
    if (text == "") setFlag(false);
    else setFlag(true);
    setSearchQuery(text);
  };
  const getProductData = () => {
    AsyncStorage.getItem("serverURL")
      .then((url) => {
        // console.log(url); // 'https://api.example.com'
        AsyncStorage.getItem("sessionId").then((sid) => {
          const server_url = `${url}/api/v1/products?name=${searchQuery}&barcode=`;
          const sessionID = `${sid}`;

          fetch(server_url, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Cookie: `session_id=${sessionID}`,
            },
          })
            .then((response) => {
              // console.log(response);
              return response.json();
            })
            .then((data) => {
              // Here, you can access the JSON data
              // console.log(data);
              // const filteredProducts = data.filter((product) =>
              //   product.name.toLowerCase().includes(searchQuery.toLowerCase())
              // );
              setProducts(data);
            })
            .catch((error) => {
              // Handle any errors that occurred during the request
              console.error(error);
            });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleProductPress = (item) => {
    navigation.navigate("Details", { product: JSON.stringify(item) });
  };
  const renderItem = ({ item }) => (
    <View style={{ paddingHorizontal: 5 }}>
      <TouchableOpacity
        style={{
          height: dimension.width * 0.23,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "white",
          borderRadius: 10,
          marginTop: 10,
          elevation: 3, // Add elevation for box shadow effect
          shadowColor: "#000",
          shadowOffset: {
            width: 2,
            height: 5,
          },
          shadowOpacity: 0.5,
          shadowRadius: 10,
        }}
        onPress={() => {
          handleProductPress(item);
        }}
      >
        <Image
          source={{ uri: `${serverUrl}${item.image_url}` }}
          style={{
            width: dimension.width * 0.2,
            height: dimension.width * 0.2,
            marginRight: 10,
            marginLeft: 10,
            backgroundColor: "#F7F7F9",
            borderRadius: 10,
          }}
        />
        <View style={{ marginLeft: 10 }}>
          <Text
            style={{
              color: "#0D6EFD",
              fontSize: dimension.width * 0.04,
              width: dimension.width * 0.6,
            }}
          >
            {item.name}
          </Text>
          <Text style={{ fontSize: 12 }}>{item.barcode}</Text>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            {/* <Text style={{ fontSize: 12 }}>${item.standard_price}</Text> */}
            <Text
              style={{ fontSize: dimension.width * 0.04, fontWeight: "bold" }}
            >
              €{item.list_price.toFixed(2)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 10,
        backgroundColor: "white",
        marginTop: -dimension.height * 0.062,
      }}
    >
      <View
        style={{
          position: "absolute",
          width: dimension.width,
          marginTop: dimension.height * 0.05,
          zIndex: 999,
        }}
      >
        <CustomHeader
          title="Product"
          iconName="add-outline"
          onBackPress={() => {
            navigation.navigate("Home");
          }}
          onFunctionPress={() => {
            navigation.navigate("New", { scanData, previousScreen });
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 10,
          marginTop: dimension.height * 0.05,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            height: dimension.height * 0.06,
            borderColor: "gray",
            borderWidth: 1,
            // marginRight: 10,
            paddingLeft: 40,
            backgroundColor: "white",
            borderColor: "white",
            borderRadius: 20,
            marginTop: dimension.height * 0.08,
            fontSize: 16,
            elevation: 2, // Add elevation for box shadow effect
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
          }}
          placeholder="Looking for shoes"
          value={searchQuery}
          onChangeText={handleSearch}
        ></TextInput>
        <TouchableOpacity onPress={() => handleSearch("")}>
          <Image
            source={require("../assets/search-icon.png")}
            style={{
              width: 15,
              height: 15,
              position: "absolute",
              marginTop: dimension.height * 0.03,
              marginLeft: -dimension.width * 0.75,
              zIndex: 99,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            handleSearch("");
          }}
          style = {{}}
        >
          <AntDesign
            name="close"
            size={22}
            color="#6A6A6A"
            style={{
              width: 22,
              height: 22,
              position: "absolute",
              //   borderRadius: dimension.height * 0.02,
              marginLeft: -dimension.width * 0.08,
              marginTop: dimension.height * 0.026,
              zIndex: 99,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={
            flag
              ? { display: "none" }
              : {
                  borderRadius: 10,
                  height: dimension.height * 0.04,
                  width: dimension.height * 0.04,
                  borderRadius: dimension.height * 0.02,
                  marginTop: dimension.height * 0.08,
                  marginLeft: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }
          }
          onPress={() => {
            navigation.navigate("Barcode", {});
          }}
        >
          <Ionicons name="barcode-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={
            flag
              ? {
                  borderRadius: 10,
                  height: dimension.height * 0.04,
                  width: dimension.height * 0.05,
                  borderRadius: dimension.height * 0.015,
                  marginTop: dimension.height * 0.08,
                  marginLeft: 10,
                  alignItems: "center",
                }
              : { display: "none" }
          }
          onPress={getProductData}
        >
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <MaterialCommunityIcons
              name="database-search-outline"
              size={24}
              color="black"
            />
          </View>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          style={{ height: dimension.height * 0.8 }}
        />
      </View>

      {/* <View
        style={{
          position: "absolute",
          backgroundColor: "white",
          marginBottom: 16,
          width: dimension.width,
          alignItems: "center",

          marginTop: dimension.height * 0.9,
        }}
      >
        <Button title="Search" onPress={getProductData} />
      </View> */}
    </View>
  );
};

export default ProductScreen;
