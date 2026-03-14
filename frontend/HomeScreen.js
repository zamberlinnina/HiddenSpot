import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HomeScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    loadUser();
    loadPlaces();
  }, []);

  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem("@user");
      if (data) {
        setUser(JSON.parse(data));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const loadPlaces = () => {
    const samplePlaces = [
      { id: "1", name: "Hidden Cafe" },
      { id: "2", name: "Secret Garden" },
      { id: "3", name: "Old Street Mural" },
    ];

    setPlaces(samplePlaces);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("@user");
    await AsyncStorage.removeItem("@app_token");
    navigation.replace("LoginScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome {user ? user.name : ""}
      </Text>

      <Text style={styles.subtitle}>Hidden places nearby:</Text>

      <FlatList
        data={places}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
          </View>
        )}
      />

      <View style={styles.space} />

      <Button title="Logout" onPress={logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    marginBottom: 10,
  },

  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },

  space: {
    height: 20,
  },
});