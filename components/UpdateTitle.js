import { StyleSheet, Text, TextInput, View, Button } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
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

//var TITLEINFO = [];
var ogDocRef = "";
export default function UpdateTitle({ route, navigation }) {
  const { title } = route.params;
  const [newTitle, setNewTitle] = useState("");
  const [TITLEINFO, setTITLEINFO] = useState({});

  // useLayoutEffect(() => {
  //   getTitleDetails();
  // }, []);

  // useEffect(() => {
  //   getTitleDetails();
  // });
  useFocusEffect(
    React.useCallback(() => {
      getTitleDetails();
    }, [])
  );

  function newTitleInputHandler(enteredText) {
    setNewTitle(enteredText);
  }

  const getTitleDetails = async () => {
    console.log("starting to get the Title data from " + title);

    ///turn into a function??
    const q = query(collection(db, "Dummy"), where("Title", "==", title));
    const querySnapshot = await getDocs(q);
    var id = "";
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      id = doc.data().id;
    });
    console.log("id: " + id);
    ogDocRef = doc(db, "Dummy", id);
    const docSnap = await getDoc(ogDocRef);

    if (docSnap.exists()) {
      console.log("Found the Title details");
      //TITLEINFO = docSnap.data();
      setTITLEINFO(docSnap.data());
      console.log("Title details:");
      console.log(TITLEINFO);
      console.log("test: " + TITLEINFO.Title);
    } else {
      console.log("lost the Title");
      //something went wrong
    }
  };

  const updateNewTitle = async () => {
    console.log("starting to update Title");
    // const docRef = doc(db, "Dummy", newTitle);
    // const docSnap = await getDoc(docRef);

    const q = query(collection(db, "Dummy"), where("Title", "==", newTitle));
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
    // if (docSnap.exists()) {
    //   //name already exists so is invalid
    //   console.log("Invalid name. Already in use.");
    //   //TODO: add some sort of alert/popup in app
    // } else {
    //   console.log("Adding new Title");
    //   updateDoc(ogDocRef, { Title: newTitle });
    // }

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
