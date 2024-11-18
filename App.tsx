import React, { useState, useEffect } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from "expo-web-browser";
import { strings } from "./constants";

interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

const iOS_REQUEST = {
  iosClientId: "74629819012-rkiav4q4uv36kerqr43bljf39sk6l96g.apps.googleusercontent.com",
  clientId: "74629819012-g2h1hmo2gdulnschu2e36ot4ha95b5lh.apps.googleusercontent.com",
  androidClientId: "74629819012-7pirurm080u9mb9r9mfak69l0cjvge7m.apps.googleusercontent.com",
}

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

const [request, response, promptAsync] = Google.useIdTokenAuthRequest(iOS_REQUEST);

  useEffect(() => {
    const fetchUserInfo = async (token: string) => {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const user = await userInfoResponse.json();
      setUserInfo(user);
    };

    if (response?.type === "success") {
      const { access_token } = response.params;
      fetchUserInfo(access_token);
    }
  }, [response]);

  const doSignIn = () => {
    promptAsync({
      showInRecents: true,
    });
  };

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View>
            <Image source={{ uri: userInfo.picture }} style={styles.profilePic} />
          <Text>{strings.name} {userInfo.name}!</Text>
          <Text>{strings.email} {userInfo.email}</Text>
        </View>
      ) : (
        <Button
          title={strings.signin_google}
          onPress={doSignIn}
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
