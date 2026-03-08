import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
// client id 173020442509-ult5qqvhtp2hp1h90e4vi41gas5glm0s.apps.googleusercontent.com
// client secret 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
import * as Google from "expo-auth-session/providers/google";
import { makeRedirectUri } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession();
export default function App() {
  const [userInfo, setUserInfo] = React.useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:
      "173020442509-ult5qqvhtp2hp1h90e4vi41gas5glm0s.apps.googleusercontent.com",
    redirectUri: makeRedirectUri({ useProxy: true }),
  });

  React.useEffect(() => {
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
