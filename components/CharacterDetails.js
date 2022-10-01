import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthenticationInfo } from "../shared";
import { getCharDetails } from "../shared";
import { deleteDoc, doc } from "firebase/firestore/lite";
import { db } from "../firebase/firebase_config";

var docInfo = [];
export default function CharacterDetails({ route, navigation }) {
  const { title, name } = route.params;
  const [DETAILS, setDETAILS] = useState({});
  const [userUID, setUserUID] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      //getCharDetails(userUID, title, name, setDETAILS);
      (async () => {
        docInfo = await getCharDetails(userUID, title, name, setDETAILS); //so that we wait to get the info we need for later
        console.log("docInfo: " + docInfo[0] + " and " + docInfo[1]);
      })();
    }, [userUID])
  );
  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
    }, [])
  );

  return (
    <View>
      <Text>CharacterDetails</Text>
      <Button
        title="Update Character"
        onPress={() =>
          navigation.navigate("UpdateCharacter", { title: title, name: name })
        }
      />
      <Button
        title="Delete Character"
        onPress={() => {
          deleteDoc(doc(db, userUID, docInfo[0], "Characters", docInfo[1]));
          navigation.navigate("CharactersPage", { title: title });
        }}
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
