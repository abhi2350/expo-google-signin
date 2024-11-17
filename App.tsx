import React, { useState, useEffect, useCallback } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from "expo-web-browser";
import { constants, strings } from "./constants";

interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
  iosClientId: constants.ios_client_id,
  clientId: constants.client_id,
  androidClientId: constants.android_client_id,
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
      setUserInfo(user);
    };

    if (response?.type === "success") {
      const { access_token } = response.params;
      fetchUserInfo(access_token);
    }
  }, [response]);

  const doSignIn = () => {
    promptAsync();
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
