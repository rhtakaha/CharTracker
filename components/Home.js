import { View, Text, Button, TextInput } from "react-native";
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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen 2</Text>
      <TextInput
        placeholder="email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        placeholder="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      <Button title="Register" onPress={registerUser} />
      {isSignedIn === true ? (
        <Button title="Sign Out" onPress={signOutUser} />
      ) : (
        <Button title="Sign In" onPress={signInUser} />
      )}
      <Button
        title="Go to Titles"
        onPress={() => navigation.navigate("Titles")}
      />
    </View>
  );
}
