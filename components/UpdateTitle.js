import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Pressable,
} from "react-native";
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
import { uploadImage } from "../shared";
import * as ImagePicker from "expo-image-picker";
import { deleteImage } from "../shared";

var ogDocRef = "";
export default function UpdateTitle({ route, navigation }) {
  const { title, titleId } = route.params;
  const [newTitle, setNewTitle] = useState("");
  const [TITLEINFO, setTITLEINFO] = useState({});
  const [userUID, setUserUID] = useState("");
  const [image, setImage] = useState(null);
  const [imageDeleted, setImageDeleted] = useState(false);

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
      setImageDeleted(false);
    }
  };

  function newTitleInputHandler(enteredText) {
    setNewTitle(enteredText);
  }

  const getTitleDetails = async () => {
    if (userUID !== "") {
      console.log("starting to get the Title data from " + title);
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
    if (newTitle !== "" || image !== null || imageDeleted) {
      //if at least one is being changed

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
        updateTitleImage();
        console.log("/nHAS THE IMAGE BEEN DELETED: " + imageDeleted);
        if (!imageDeleted) {
          updateDoc(ogDocRef, {
            Title: newTitle ? newTitle : TITLEINFO.Title,
            image: image ? image : TITLEINFO.Title,
          });
        } else {
          // if the image was deleted and not replaced
          updateDoc(ogDocRef, {
            Title: newTitle ? newTitle : TITLEINFO.Title,
            image: "",
          });
        }
      }
    }

    //take us out to the titles page
    navigation.navigate("Titles");
  };

  const updateTitleImage = async () => {
    if (image !== null) {
      //add/replace title image
      await uploadImage(userUID, image, titleId);
    }
  };

  const deleteTitleImage = async () => {
    deleteImage(userUID, titleId);
    // updateDoc(ogDocRef, {
    //   image: "",
    // });
    setImageDeleted(true);
  };

  function removePickedImage() {
    setImage(null);
  }

  return (
    <View style={styles.container}>
      <View style={styles.image}>
        {TITLEINFO.image && (
          <Image
            source={{ uri: TITLEINFO.image }}
            style={{ width: 200, height: 200 }}
          />
        )}
      </View>
      <TextInput
        placeholder="New Title"
        onChangeText={newTitleInputHandler}
        value={newTitle}
        style={styles.inputContainer}
      />

      <View style={styles.buttonContainer}>
        <Pressable
          android_ripple={{ color: "#dddddd" }}
          onPress={deleteTitleImage}
          style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
        >
          <Text style={styles.buttonText}>Delete current image</Text>
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

      <View style={styles.buttonContainer}>
        <Pressable
          android_ripple={{ color: "#dddddd" }}
          onPress={updateNewTitle}
          style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
        >
          <Text style={styles.buttonText}>Enter</Text>
        </Pressable>
      </View>
    </View>
  );
}

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
  buttonContainer: { margin: 5, borderRadius: 6, backgroundColor: "#86ac41" },
  buttonText: { padding: 8, alignSelf: "center", color: "black" },
  pressedButton: {
    opacity: 0.5,
  },
  image: {
    alignSelf: "center",
  },
});
