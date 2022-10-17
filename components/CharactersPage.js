import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  Button,
  Pressable,
  Image,
} from "react-native";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore/lite";
import CharacterItem from "./CharacterItem";
import React, { useState } from "react";
import { db } from "../firebase/firebase_config";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthenticationInfo } from "../shared";
import Confirmation from "./Confirmation";
import { checkCached } from "../shared";
import { downloadImage } from "../shared";

//var id = "";
export default function CharactersPage({ route, navigation }) {
  const { title, titleId } = route.params;
  const [CHARS, setCHARS] = useState({});
  const [userUID, setUserUID] = useState("");
  const [confirmationIsVisible, setConfirmationIsVisible] = useState(false);

  function startConfirmationHandler() {
    setConfirmationIsVisible(true);
  }

  function endConfirmationHandler() {
    setConfirmationIsVisible(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      getChars();
    }, [userUID])
  );

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
    }, [])
  );

  function goToCharDetails(givenId) {
    //passes the title and the character name onto details page
    navigation.navigate("CharacterDetails", {
      title: title,
      titleId: titleId,
      charId: givenId,
    });
  }

  const renderItem = ({ item }) => (
    <CharacterItem
      name={item.Name}
      charId={item.id}
      image={item.image}
      goToDetails={goToCharDetails}
    />
  );

  const getChars = async () => {
    if (userUID !== "") {
      console.log("starting to get the data from " + title);

      // const q = query(collection(db, userUID), where("Title", "==", title));
      // const querySnapshot = await getDocs(q);
      // id = "";
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   id = doc.data().id;
      // });
      // console.log("id: " + id);

      const titleCol = collection(db, userUID, titleId, "Characters");
      const titleSnapshot = await getDocs(titleCol);

      setCHARS(titleSnapshot.docs.map((doc) => doc.data()));
      console.log("finished collecting data");
      console.log(CHARS);
      for (const item in CHARS) {
        console.log("Image: " + CHARS[item].image);
        if (CHARS[item].image !== undefined) {
          //if there is an associated image

          console.log("cached: " + (await checkCached(CHARS[item].image)));
          if ((await checkCached(CHARS[item].image)) !== "memory") {
            //if image is not cached then download and cache
            console.log("downloading");
            await downloadImage(userUID, CHARS[item].id);
          }
        }
      }
    }
  };

  const deleteTitle = async () => {
    //first check if the collection is empty, if so just delete
    const col = collection(db, userUID, titleId, "Characters");
    const colSnap = await getDocs(col);
    if (colSnap.docs.length != 0) {
      //if not then go through and delete each character one by one and finally the collection at the end
      const titleCol = collection(db, userUID, titleId, "Characters");
      const titleSnapshot = await getDocs(titleCol);
      titleSnapshot.forEach((document) => {
        var charId = document.data().id;
        deleteDoc(doc(db, userUID, titleId, "Characters", charId));
      });
      //now delete the title itself
      deleteDoc(doc(db, userUID, titleId));
    } else {
      //empty Title so simply delete
      deleteDoc(doc(db, userUID, titleId));
    }

    navigation.navigate("Titles");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <Button
        title="Add Character"
        onPress={() => navigation.navigate("AddCharacters", { title: title })}
      /> */}
      <View style={styles.buttonContainer}>
        <Pressable
          android_ripple={{ color: "#dddddd" }}
          onPress={() =>
            navigation.navigate("AddCharacters", {
              title: title,
              titleId: titleId,
            })
          }
          style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
        >
          <Text style={styles.buttonText}>Add Character</Text>
        </Pressable>
      </View>
      {/* <Button
        title="Update Title"
        onPress={() => navigation.navigate("UpdateTitle", { title: title })}
      /> */}
      <View style={styles.buttonContainer}>
        <Pressable
          android_ripple={{ color: "#dddddd" }}
          onPress={() =>
            navigation.navigate("UpdateTitle", {
              title: title,
              titleId: titleId,
            })
          }
          style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
        >
          <Text style={styles.buttonText}>Update Title</Text>
        </Pressable>
      </View>
      {/* <Button title="Delete Title" onPress={startConfirmationHandler} /> */}
      <View style={styles.buttonContainer}>
        <Pressable
          android_ripple={{ color: "#dddddd" }}
          onPress={startConfirmationHandler}
          style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
        >
          <Text style={styles.buttonText}>Delete Title</Text>
        </Pressable>
      </View>
      <Confirmation
        text="Are you sure you want to delete this Title?"
        visible={confirmationIsVisible}
        onConfirm={deleteTitle}
        onCancel={endConfirmationHandler}
        confirmColor={{ backgroundColor: "red" }}
      />
      <FlatList
        data={CHARS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003B46",
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  pressedButton: {
    opacity: 0.5,
  },
  buttonText: {
    padding: 8,
    alignSelf: "center",
    color: "black",
  },
  buttonContainer: {
    margin: 5,
    borderRadius: 6,
    backgroundColor: "#86ac41",
  },
});
