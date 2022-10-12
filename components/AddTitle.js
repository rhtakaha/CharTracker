import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  Pressable,
} from "react-native";
import { useState } from "react";
import React from "react";
import { db } from "../firebase/firebase_config";
import {
  setDoc,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore/lite";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthenticationInfo } from "../shared";

export default function AddTitle({ navigation }) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [userUID, setUserUID] = useState("");

  function titleInputHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
    }, [])
  );

  // first check if the collection exists,
  //    -if it does then add to it
  //    -if not then make a collection and add the document
  const setData = async () => {
    console.log("starting set Title");
    if (enteredTitle === "") {
      alert("No Title Entered!");
      return;
    }
    const col = collection(db, userUID);
    const colSnap = await getDocs(col);
    if (colSnap.docs.length != 0) {
      //the collection exists so add to it
      const docRef = doc(db, userUID, enteredTitle);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //name already exists so is invalid
        console.log("Invalid name. Already in use.");
        //TODO: add some sort of alert/popup in app
      } else {
        console.log("Adding new Title");
        await setDoc(doc(db, userUID, enteredTitle), {
          Title: enteredTitle,
          id: enteredTitle, //might be bad but should work TODO: see what the key/id per item is for
        });
      }
    } else {
      //the collection doesn't exist so make it and add the first title
      await setDoc(doc(db, userUID, enteredTitle), {
        Title: enteredTitle,
        id: enteredTitle, //might be bad but should work TODO: see what the key/id per item is for
      });
    }
    navigation.navigate("Titles");
  };
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Title"
          onChangeText={titleInputHandler}
          value={enteredTitle}
          style={styles.input}
        />
      </View>
      {/* <Button title="Enter" onPress={setData} /> */}
      <View style={styles.buttonContainer}>
        <Pressable
          android_ripple={{ color: "#dddddd" }}
          onPress={setData}
          style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
        >
          <Text style={styles.buttonText}>Enter</Text>
        </Pressable>
      </View>
    </View>
  );
}
//TODO: eventually move common things like buttons to common file???
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003B46",
    justifyContent: "center",
  },
  inputContainer: {
    backgroundColor: "#c4dfe6",
    aspectRatio: 7,
    margin: 5,
    padding: 5,
    borderRadius: 4,
    alignSelf: "center",
  },
  input: {
    color: "black",
    fontSize: 20,
  },
  buttonContainer: { margin: 9, borderRadius: 6, backgroundColor: "#86ac41" },
  buttonText: { padding: 8, alignSelf: "center", color: "black" },
  pressedButton: {
    opacity: 0.5,
  },
});
