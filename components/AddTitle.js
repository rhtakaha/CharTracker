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
import { db, auth } from "../firebase/firebase_config";
import {
  setDoc,
  doc,
  getDoc,
  collection,
  getDocs,
} from "firebase/firestore/lite";
import { onAuthStateChanged } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthenticationInfo } from "../shared";

export default function AddTitle() {
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

  // //TODO: repetitive function, there has to be a way to import/export/ use functions between files
  // const getAuthenticationInfo = async () => {
  //   console.log("getting user data!");
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       //user is signed in
  //       console.log("user signed in. UID: " + user.uid);
  //       setUserUID(user.uid);
  //       return;
  //     } else {
  //       //not signed in which would not practically happen
  //     }
  //   });
  // };

  // first check if the collection exists,
  //    -if it does then add to it
  //    -if not then make a collection and add the document
  const setData = async () => {
    console.log("starting set Title");
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
  };
  return (
    <View>
      <Text>Add Title</Text>
      <TextInput
        placeholder="Title"
        onChangeText={titleInputHandler}
        value={enteredTitle}
      />
      <Button title="Enter" onPress={setData} />
    </View>
  );
}
