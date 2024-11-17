import React, { useState, useEffect } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from "expo-web-browser";

interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  iosClientId: "74629819012-rkiav4q4uv36kerqr43bljf39sk6l96g.apps.googleusercontent.com",
  clientId: "74629819012-g2h1hmo2gdulnschu2e36ot4ha95b5lh.apps.googleusercontent.com",
  androidClientId: "74629819012-7pirurm080u9mb9r9mfak69l0cjvge7m.apps.googleusercontent.com",
});

  useEffect(() => {
    const fetchUserInfo = async (token: string) => {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await userInfoResponse.json();
      console.log("break 2", user);
      setUserInfo(user);
    };

    if (response?.type === "success") {
      const { access_token } = response.params;
      fetchUserInfo(access_token);
    }
  }, [response]);

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View>
            <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
          <Text>Name: {userInfo.name}!</Text>
          <Text>Email: {userInfo.email}</Text>
        </View>
      ) : (
        <Button
          title="Sign in with Google"
          onPress={() => {
            promptAsync({
              showInRecents: true,
            });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePic: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: "center"
  },
});
