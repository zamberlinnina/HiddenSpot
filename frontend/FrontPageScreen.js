import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";

export default function FrontPageScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HiddenSpot</Text>

      <Text style={styles.text}>
        Find hidden places in your city.
      </Text>

      <Text style={styles.text}>
        Discover spots recommended based on your interests.
      </Text>

      <View style={styles.space} />

      <Button
        title="Start"
        onPress={() => navigation.navigate("LoginScreen")}
      />

      <View style={styles.space} />

      <Button
        title="Sign in with Google"
        onPress={() => navigation.navigate("LoginScreen")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
  },

  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
  },

  space: {
    height: 20,
  },
});