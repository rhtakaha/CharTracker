import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase/firebase_config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

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
    <View style={styles.container}>
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.inputs}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
        style={styles.inputs}
      />
      {/* <Button title="Register" onPress={registerUser} /> */}
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
        // <Button title="Sign Out" onPress={signOutUser} />
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
        // <Button title="Sign In" onPress={signInUser} />
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
      {/* <Button
        title="Go to Titles"
        onPress={() => navigation.navigate("Titles")}
      /> */}
      <View style={styles.toTitlesButton}>
        <Pressable
          android_ripple={{ color: "#dddddd" }}
          onPress={() => navigation.navigate("Titles")}
          style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
        >
          <Text style={styles.toTitlesButtonText}>Go To Titles</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003B46",
    alignItems: "center",
    justifyContent: "center",
  },
  inputs: {
    color: "white",
  },
  registerButtonBody: {
    margin: 9,
    borderRadius: 6,
    backgroundColor: "#86ac41",
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
  signInButtonBody: { margin: 9, borderRadius: 6, backgroundColor: "#66A5AD" },
  signInButtonText: {
    padding: 8,
    alignSelf: "center",
    color: "black",
    fontSize: 20,
  },
  signOutButtonBody: { margin: 9, borderRadius: 6, backgroundColor: "red" },
  signOutButtonText: {
    padding: 8,
    alignSelf: "center",
    color: "black",
    fontSize: 20,
  },
  toTitlesButton: {
    margin: 9,
    borderRadius: 6,
    backgroundColor: "#4cb5f5",
  },
  toTitlesButtonText: {
    padding: 8,
    alignSelf: "center",
    color: "black",
    fontSize: 20,
  },
});
