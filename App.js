import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";

WebBrowser.maybeCompleteAuthSession();
export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);
  const googleClientId =
    Constants.expoConfig?.extra?.GOOGLE_CLIENT_ID ||
    Constants.manifest?.extra?.GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    "REPLACE_WITH_CLIENT_ID";

  const redirectUri = makeRedirectUri({ useProxy: true });
  console.log("GOOGLE_CLIENT_ID=", googleClientId);
  console.log("Computed redirectUri=", redirectUri);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: googleClientId,
    redirectUri: redirectUri,
  });

  React.useEffect(() => {
    console.log("Auth response ->", response);
    handleSignInWithGoogle();
  }, [response]);
  async function handleSignInWithGoogle() {
    const user = await AsyncStorage.getItem("@user");
    if (!user) {
      if (response?.type === "success") {
        await getUserInfo(response.authentication.accessToken);
      }
    } else {
      setUserInfo(JSON.parse(user));
    }
  }

  const getUserInfo = async (token) => {
    if (!token) return;
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const userInfo = await response.json();
      setUserInfo(userInfo);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(userInfo)}</Text>
      <Text>Open up App.js to start working on your app!</Text>
      <Button
        title="Sign in with Google"
        onPress={() => promptAsync({ useProxy: true, showInBrowser: true })}
      />
      <Button
        title="Delete local storage"
        onPress={async () => {
          try {
            await AsyncStorage.removeItem("@user");
            setUserInfo(null);
          } catch (e) {
            console.error("Failed to remove @user", e);
          }
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
