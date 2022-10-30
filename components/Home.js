import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase/firebase_config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home({ navigation }) {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const registerUser = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((n) => {
        console.log(n);
        console.log("worked");
        setIsSignedIn(true);
      })
      .catch((error) => alert(error.message));
  };

  const signInUser = () => {
    console.log("trying to sign in");
    signInWithEmailAndPassword(auth, email, password)
      .then((n) => {
        setIsSignedIn(true);
        console.log("signed in");
        navigation.navigate("Titles");
      })
      .catch((error) => alert(error.message));
  };

  const signOutUser = () => {
    signOut(auth)
      .then((n) => {
        setIsSignedIn(false);
        console.log("signed out");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.inputs}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry={true}
            style={styles.inputs}
          />
        </View>

        <View style={styles.registerButtonBody}>
          <Pressable
            android_ripple={{ color: "#dddddd" }}
            onPress={registerUser}
            style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
          >
            <Text style={styles.registerButtonText}>Register</Text>
          </Pressable>
        </View>
        {isSignedIn === true ? (
          <View style={styles.signOutButtonBody}>
            <Pressable
              android_ripple={{ color: "#dddddd" }}
              onPress={signOutUser}
              style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
            >
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.signInButtonBody}>
            <Pressable
              android_ripple={{ color: "#dddddd" }}
              onPress={signInUser}
              style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </Pressable>
          </View>
        )}
        <View style={styles.toTitlesButton}>
          <Pressable
            android_ripple={{ color: "#dddddd" }}
            onPress={() => navigation.navigate("Titles")}
            style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
          >
            <Text style={styles.toTitlesButtonText}>Go To Titles</Text>
          </Pressable>
        </View>
        <BannerAd
          unitId={TestIds.BANNER}
          size={BannerAdSize.LARGE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#003B46",
    alignItems: "center",
    justifyContent: "center",
  },
  inputs: {
    color: "black",
    fontSize: 20,
  },
  registerButtonBody: {
    margin: 5,
    borderRadius: 6,
    backgroundColor: "#4cb5f5",
  },
  pressedButton: {
    opacity: 0.5,
  },
  registerButtonText: {
    padding: 8,
    alignSelf: "center",
    color: "black",
    fontSize: 20,
  },
  signInButtonBody: { margin: 5, borderRadius: 6, backgroundColor: "#4cb5f5" },
  signInButtonText: {
    padding: 8,
    alignSelf: "center",
    color: "black",
    fontSize: 20,
  },
  signOutButtonBody: { margin: 5, borderRadius: 6, backgroundColor: "red" },
  signOutButtonText: {
    padding: 8,
    alignSelf: "center",
    color: "black",
    fontSize: 20,
  },
  toTitlesButton: {
    margin: 5,
    borderRadius: 6,
    backgroundColor: "#4cb5f5",
  },
  toTitlesButtonText: {
    padding: 8,
    alignSelf: "center",
    color: "black",
    fontSize: 20,
  },
  inputContainer: {
    backgroundColor: "white",
    aspectRatio: 7,
    margin: 5,
    padding: 5,
    borderRadius: 4,
  },
});
