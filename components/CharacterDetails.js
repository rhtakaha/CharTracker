import { StyleSheet, Text, View, Button } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { db, auth } from "../firebase/firebase_config";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore/lite";
import { useFocusEffect } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";
import { getAuthenticationInfo } from "../shared";
import { getCharDetails } from "../shared";

//var DETAILS = [];
export default function CharacterDetails({ route, navigation }) {
  const { title, name } = route.params;
  const [DETAILS, setDETAILS] = useState({});
  const [userUID, setUserUID] = useState("");

  // useLayoutEffect(() => {
  //   getCharDetails();
  // }, []);
  //   useEffect(() => {
  //     getCharDetails();
  //   });
  useFocusEffect(
    React.useCallback(() => {
      getCharDetails(userUID, title, name, setDETAILS);
    }, [userUID])
  );
  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
    }, [])
  );

  // const getCharDetails = async () => {
  //   if (userUID !== "") {
  //     console.log("starting to get the data from " + title + " about " + name);
  //     const q = query(collection(db, userUID), where("Title", "==", title));
  //     const querySnapshot = await getDocs(q);
  //     var titleId = "";
  //     querySnapshot.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       titleId = doc.data().id;
  //     });

  //     const q2 = query(
  //       collection(db, userUID, titleId, "Characters"),
  //       where("Name", "==", name)
  //     );
  //     const querySnapshot2 = await getDocs(q2);
  //     var charId = "";
  //     querySnapshot2.forEach((doc) => {
  //       // doc.data() is never undefined for query doc snapshots
  //       charId = doc.data().id;
  //     });

  //     const docRef = doc(db, userUID, titleId, "Characters", charId);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       console.log("Found the character details");
  //       //DETAILS = docSnap.data();
  //       setDETAILS(docSnap.data());
  //       console.log("char details:");
  //       console.log(DETAILS);
  //       console.log("testing: " + DETAILS.Name);
  //     } else {
  //       console.log("lost the character");
  //       //something went wrong
  //     }
  //   }
  // };

  return (
    <View>
      <Text>CharacterDetails</Text>
      <Button
        title="Update Character"
        onPress={() =>
          navigation.navigate("UpdateCharacter", { title: title, name: name })
        }
      />
      <Text>{"Name: " + DETAILS.Name}</Text>
      <Text>{"Profession: " + DETAILS.Profession}</Text>
      <Text>{"Allies: " + DETAILS.Allies}</Text>
      <Text>{"Enemies: " + DETAILS.Enemies}</Text>
      <Text>{"Associates: " + DETAILS.Associates}</Text>
      <Text>{"Weapons: " + DETAILS.Weapons}</Text>
      <Text>{"Vehicle/Mount(s): " + DETAILS.Vehicles_Mounts}</Text>
      <Text>{"Affiliation: " + DETAILS.Affiliation}</Text>
      <Text>{"Abilities: " + DETAILS.Abilities}</Text>
      <Text>{"Race/People: " + DETAILS.Race_People}</Text>
      <Text>{"Bio/Notes: " + DETAILS.Bio_Notes}</Text>
    </View>
  );
}

const styles = StyleSheet.create({});
