import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import React from "react";
import { useState } from "react";
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

export default function AddCharacters({ route, navigation }) {
  const { title } = route.params;

  const [enteredName, setEnteredName] = useState("");
  const [enteredProfession, setEnteredProfession] = useState("");
  const [enteredAllies, setEnteredAllies] = useState("");
  const [enteredEnemies, setEnteredEnemies] = useState("");
  const [enteredAssociates, setEnteredAssociates] = useState("");
  const [enteredWeapons, setEnteredWeapons] = useState("");
  const [enteredVehicle_Mounts, setEnteredVehicles_Mounts] = useState("");
  const [enteredAffiliation, setEnteredAffiliation] = useState("");
  const [enteredAbilities, setEnteredAbilities] = useState("");
  const [enteredRace_People, setEnteredRace_People] = useState("");
  const [enteredBio_Notes, setEnteredBio_Notes] = useState("");

  const [userUID, setUserUID] = useState("");

  function nameInputHandler(enteredText) {
    setEnteredName(enteredText);
  }

  function professionInputHandler(enteredText) {
    setEnteredProfession(enteredText);
  }

  function alliesInputHandler(updated) {
    setEnteredAllies(updated);
  }

  function enemiesInputHandler(updated) {
    setEnteredEnemies(updated);
  }

  function associatesInputHandler(updated) {
    setEnteredAssociates(updated);
  }

  function weaponsInputHandler(updated) {
    setEnteredWeapons(updated);
  }

  function vehicles_MountsInputHandler(updated) {
    setEnteredVehicles_Mounts(updated);
  }

  function affiliationInputHandler(updated) {
    setEnteredAffiliation(updated);
  }

  function abilitiesInputHandler(updated) {
    setEnteredAbilities(updated);
  }

  function race_PeopleInputHandler(updated) {
    setEnteredRace_People(updated);
  }

  function bio_NotesInputHandler(updated) {
    setEnteredBio_Notes(updated);
  }

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
    }, [])
  );

  const setChar = async () => {
    if (enteredName !== "") {
      console.log("starting set Character");
      const q = query(collection(db, userUID), where("Title", "==", title));
      const querySnapshot = await getDocs(q);
      var titleId = "";
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        titleId = doc.data().id;
      });
      const docRef = doc(db, userUID, titleId, "Characters", enteredName);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        //name already exists so is invalid
        console.log("Invalid name. Already in use.");
        //TODO: add some sort of alert/popup in app
      } else {
        console.log("Adding new Character");
        await setDoc(doc(db, userUID, titleId, "Characters", enteredName), {
          Name: enteredName,
          id: enteredName, //might be bad but should work TODO: see what the key/id per item is for
          Profession: enteredProfession,
          Allies: enteredAllies,
          Enemies: enteredEnemies,
          Associates: enteredAssociates,
          Weapons: enteredWeapons,
          Vehicles_Mounts: enteredVehicle_Mounts,
          Affiliation: enteredAffiliation,
          Abilities: enteredAbilities,
          Race_People: enteredRace_People,
          Bio_Notes: enteredBio_Notes,
        });
      }
    } else {
      console.log("NAME REQUIRED, NOT ENTERED");
    }
    navigation.navigate("CharactersPage", { title: title }); //TODO: test this
  };

  return (
    <View>
      <Text>AddCharacters</Text>
      <TextInput
        placeholder="Name (full)"
        onChangeText={nameInputHandler}
        value={enteredName}
      />
      <TextInput
        placeholder="Profession"
        onChangeText={professionInputHandler}
        value={enteredProfession}
      />
      <TextInput
        placeholder="Allies"
        onChangeText={alliesInputHandler}
        value={enteredAllies}
      />
      <TextInput
        placeholder="Enemies"
        onChangeText={enemiesInputHandler}
        value={enteredEnemies}
      />
      <TextInput
        placeholder="Associates"
        onChangeText={associatesInputHandler}
        value={enteredAssociates}
      />
      <TextInput
        placeholder="Weapons"
        onChangeText={weaponsInputHandler}
        value={enteredWeapons}
      />
      <TextInput
        placeholder="Vehicle/Mount(s)"
        onChangeText={vehicles_MountsInputHandler}
        value={enteredVehicle_Mounts}
      />
      <TextInput
        placeholder="Affiliation"
        onChangeText={affiliationInputHandler}
        value={enteredAffiliation}
      />
      <TextInput
        placeholder="Abilities"
        onChangeText={abilitiesInputHandler}
        value={enteredAbilities}
      />
      <TextInput
        placeholder="Race/People"
        onChangeText={race_PeopleInputHandler}
        value={enteredRace_People}
      />
      <TextInput
        placeholder="Bio/Notes"
        onChangeText={bio_NotesInputHandler}
        value={enteredBio_Notes}
      />
      <Button title="Submit" onPress={setChar} />
      <Button
        title="Cancel"
        onPress={() => navigation.navigate("CharactersPage", { title: title })}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
