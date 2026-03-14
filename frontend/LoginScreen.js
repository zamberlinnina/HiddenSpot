import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const [loading, setLoading] = React.useState(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "",
    scopes: ["openid", "profile", "email"],
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        handleIdToken(idToken);
      } else {
        Alert.alert("Login failed", "No id_token returned from Google.");
      }
    } else if (response?.type === "error") {
      Alert.alert("Login error", "Google auth returned an error.");
    }
  }, [response]);

  const handleIdToken = async (idToken) => {
    setLoading(true);
    try {
      const resp = await fetch("http://localhost:3000/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_token: idToken }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        console.error("Backend error:", data);
        Alert.alert("Server error", data.error || "Failed to authenticate.");
        setLoading(false);
        return;
      }

      const { token, user } = data;
      if (!token || !user) {
        Alert.alert("Server error", "Invalid response from server.");
        setLoading(false);
        return;
      }

      await AsyncStorage.setItem("@app_token", token);
      await AsyncStorage.setItem("@user", JSON.stringify(user));

      setLoading(false);
      navigation.replace("HomeScreen");
    } catch (err) {
      console.error("Network error:", err);
      Alert.alert("Network error", "Unable to contact backend.");
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HiddenSpot</Text>
      <Text style={styles.subtitle}>Discover hidden places around you</Text>

      <View style={styles.spacer} />

      <TouchableOpacity
        style={[styles.googleButton, (!request || loading) && styles.disabledButton]}
        onPress={() => promptAsync()}
        disabled={!request || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.googleButtonText}>Sign in with Google</Text>
        )}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.smallText}>
          By signing in you agree to the app's terms of use.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },
  spacer: {
    height: 32,
  },
  googleButton: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#4285F4",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  disabledButton: {
    opacity: 0.6,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    marginTop: 28,
    alignItems: "center",
  },
  smallText: {
    color: "#9ca3af",
    fontSize: 12,
  },
});
