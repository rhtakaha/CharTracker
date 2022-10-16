import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
var uuid = require("uuid");

export default function AddTitle({ navigation }) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [userUID, setUserUID] = useState("");
  const [image, setImage] = useState(null);
  const [recImage, setRecImage] = useState(null);

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

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = function () {
        // return the blob
        console.log("BLOB created!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        // something went wrong
        reject(new Error("uriToBlob failed"));
      };

      // this helps us get a blob
      xhr.responseType = "blob";

      xhr.open("GET", uri, true);
      xhr.send(null);
    });
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

  const uploadImage = async (newId) => {
    const storage = getStorage();
    console.log("starting image upload\n");
    // Create a reference to where the image should go in firebase storage
    const imageRef = ref(storage, userUID + "/" + newId);
    console.log("references created");
    uploadBytes(imageRef, await uriToBlob(image)).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    //----------------------------
    // fetch(image)
    //   .then((res) => res.blob()) // Gets the response and returns it as a blob
    //   .then((blob) => {
    //     // Here's where you get access to the blob
    //     uploadBytes(imageRef, blob).then(
    //       (snapshot) => {
    //         console.log("Uploaded a blob or file!");
    //       },
    //       (error) => {
    //         console.log("Failed upload!!");
    //         // A full list of error codes is available at
    //         // https://firebase.google.com/docs/storage/web/handle-errors
    //         switch (error.code) {
    //           case "storage/unauthorized":
    //             // User doesn't have permission to access the object
    //             break;
    //           case "storage/canceled":
    //             // User canceled the upload
    //             break;

    //           // ...

    //           case "storage/unknown":
    //             // Unknown error occurred, inspect error.serverResponse
    //             break;
    //         }
    //       }
    //     );
    //   })
    //   .catch(error);
  };

  //TODO: need this to be in the TitleItem page so need some way to pass references
  //TODO: also need to figure out the actualy "schema" of storage, probably add a folder per user - might make images a premium feature since it seems to be more data intensive, but hopefully not
  const downloadImage = async () => {
    console.log("starting to download image\n");
    const storage = getStorage();
    // Create a reference to the image in firebase storage
    const imageRef = ref(storage, "some-child");

    // let temp = getImage(imageRef);
    // console.log("temp: " + temp);
    // setRecImage(temp);

    // getDownloadURL(imageRef)
    //   .then((url) => {
    //     // `url` is the download URL for 'images/stars.jpg'

    //     // This can be downloaded directly:
    //     const xhr = new XMLHttpRequest();
    //     xhr.responseType = "blob";
    //     xhr.onload = async (event) => {
    //       const blob = xhr.response;
    //       console.log("The blob: " + blob);
    //       setRecImage(URL.createObjectURL(blob));
    //     };
    //     xhr.open("GET", url);
    //     xhr.send();
    //   })
    //   .catch((error) => {
    //     // Handle any errors
    //     console.log("THERE WAS AN ERROR");
    //   });
    console.log("sending req");
    const img = await getDownloadURL(imageRef);
    console.log("received: " + img);
    setRecImage(img);
    console.log("where 'image' is: " + image);
    console.log("should have the image: " + recImage);
    Image.prefetch(recImage);
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
          await uploadImage(newId);
        }
        await setDoc(doc(db, userUID, newId), {
          Title: enteredTitle,
          id: newId,
          image: image ? image : "",
        });
      }
      // const docRef = doc(db, userUID, enteredTitle);
      // const docSnap = await getDoc(docRef);

      // if (docSnap.exists()) {
      //   //name already exists so is invalid
      //   console.log("Invalid name. Already in use.");
      //   //TODO: add some sort of alert/popup in app
      // } else {
      //   console.log("Adding new Title");
      //   await setDoc(doc(db, userUID, enteredTitle), {
      //     Title: enteredTitle,
      //     id: enteredTitle, //might be bad but should work TODO: see what the key/id per item is for
      //   });
      // }
    } else {
      //the collection doesn't exist so make it and add the first title
      const newId = uuid.v4();
      if (image !== null) {
        await uploadImage();
      }
      await setDoc(doc(db, userUID, newId), {
        Title: enteredTitle,
        id: newId,
        image: image ? image : "",
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
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <Button title="Upload image?" onPress={uploadImage} />
      <Button title="Download image?" onPress={downloadImage} />
      {recImage && (
        <Image source={{ uri: recImage }} style={{ width: 200, height: 200 }} />
      )}
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
