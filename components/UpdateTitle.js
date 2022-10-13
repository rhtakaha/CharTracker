import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import React, { useState } from "react";
import { db } from "../firebase/firebase_config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore/lite";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthenticationInfo } from "../shared";

var ogDocRef = "";
export default function UpdateTitle({ route, navigation }) {
  const { title, titleId } = route.params;
  const [newTitle, setNewTitle] = useState("");
  const [TITLEINFO, setTITLEINFO] = useState({});
  const [userUID, setUserUID] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      getTitleDetails();
    }, [userUID])
  );

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
    }, [])
  );

  function newTitleInputHandler(enteredText) {
    setNewTitle(enteredText);
  }

  const getTitleDetails = async () => {
    if (userUID !== "") {
      console.log("starting to get the Title data from " + title);

      // const q = query(collection(db, userUID), where("Title", "==", title));
      // const querySnapshot = await getDocs(q);
      // var id = "";
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   id = doc.data().id;
      // });
      // console.log("id: " + id);
      ogDocRef = doc(db, userUID, titleId);
      const docSnap = await getDoc(ogDocRef);

      if (docSnap.exists()) {
        console.log("Found the Title details");
        setTITLEINFO(docSnap.data());
        console.log("Title details:");
        console.log(TITLEINFO);
        console.log("test: " + TITLEINFO.Title);
      } else {
        console.log("lost the Title");
        //something went wrong
      }
    }
  };

  const updateNewTitle = async () => {
    console.log("starting to update Title");

    const q = query(collection(db, userUID), where("Title", "==", newTitle));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.exists()) {
        //name already exists so is invalid
        console.log("Invalid name. Already in use.");
        //TODO: add some sort of alert/popup in app
      }
    });
    if (querySnapshot.empty) {
      console.log("Adding new Title");
      console.log("Updating " + ogDocRef + " and there it is");
      updateDoc(ogDocRef, { Title: newTitle });
    }

    //take us out to the titles page
    navigation.navigate("Titles");
  };

  return (
    <View>
      <Text>UpdateTitle</Text>
      <Text>{"Current Title: " + TITLEINFO.Title}</Text>
      <TextInput
        placeholder="New Title"
        onChangeText={newTitleInputHandler}
        value={newTitle}
      />
      <Button title="Enter" onPress={updateNewTitle} />
    </View>
  );
}

const styles = StyleSheet.create({});
