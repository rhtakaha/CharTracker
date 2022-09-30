import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthenticationInfo } from "../shared";
import { getCharDetails } from "../shared";

export default function CharacterDetails({ route, navigation }) {
  const { title, name } = route.params;
  const [DETAILS, setDETAILS] = useState({});
  const [userUID, setUserUID] = useState("");

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
