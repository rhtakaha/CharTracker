import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Image,
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
  query,
  where,
} from "firebase/firestore/lite";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthenticationInfo } from "../shared";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../shared";
var uuid = require("uuid");

export default function AddTitle({ navigation }) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [userUID, setUserUID] = useState("");
  const [image, setImage] = useState(null);

  function titleInputHandler(enteredText) {
    setEnteredTitle(enteredText);
  }

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
    }, [])
  );

  const isTitleIdUnique = async (db, userUID, newId) => {
    const docRef = doc(db, userUID, newId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return false;
    }
    return true;
  };

  const isTitleUnique = async (userUID, title) => {
    const q = query(collection(db, userUID), where("Title", "==", title));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  //function taken from the expo documentation: https://docs.expo.dev/versions/latest/sdk/imagepicker/?redirected
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

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
      if (!(await isTitleUnique(userUID, enteredTitle))) {
        //if the entered title already exists block it
        console.log("Invalid name. Already in use.");
        //TODO: add some sort of alert/popup in app
      } else {
        //keep generating ids until get a unique one (should be first time but to be sure)
        let newId;
        do {
          newId = uuid.v4();
        } while (!(await isTitleIdUnique(db, userUID, newId)));

        //now that we have the id we can construct
        console.log("Adding new Title");
        if (image !== null) {
          await uploadImage(userUID, image, newId);
        }
        await setDoc(doc(db, userUID, newId), {
          Title: enteredTitle,
          id: newId,
          image: image ? image : "",
        });
      }
    } else {
      //the collection doesn't exist so make it and add the first title
      const newId = uuid.v4();
      if (image !== null) {
        await uploadImage(userUID, image, newId);
      }
      await setDoc(doc(db, userUID, newId), {
        Title: enteredTitle,
        id: newId,
        image: image ? image : "",
      });
    }
    navigation.navigate("Titles");
  };

  function removePickedImage() {
    setImage(null);
  }

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
      <View style={styles.buttonContainer}>
        <Pressable
          android_ripple={{ color: "#dddddd" }}
          onPress={setData}
          style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
        >
          <Text style={styles.buttonText}>Enter</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          android_ripple={{ color: "#dddddd" }}
          onPress={removePickedImage}
          style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
        >
          <Text style={styles.buttonText}>Remove picked image</Text>
        </Pressable>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          android_ripple={{ color: "#dddddd" }}
          onPress={pickImage}
          style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
        >
          <Text style={styles.buttonText}>Pick an image from camera roll</Text>
        </Pressable>
      </View>
      <View style={styles.image}>
        {image && (
          <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
        )}
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
  buttonContainer: { margin: 5, borderRadius: 6, backgroundColor: "#86ac41" },
  buttonText: { padding: 8, alignSelf: "center", color: "black" },
  pressedButton: {
    opacity: 0.5,
  },
  image: {
    alignSelf: "center",
  },
});
