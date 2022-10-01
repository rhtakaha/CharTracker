import { StyleSheet, Text, View, Button, TextInput } from "react-native";
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
import { getCharDetails } from "../shared";

var ogDocInfo = [];
export default function UpdateCharacter({ route, navigation }) {
  const { title, name } = route.params;
  const [newName, setNewName] = useState("");
  const [newProfession, setNewProfession] = useState("");
  const [newAllies, setNewAllies] = useState("");
  const [newEnemies, setNewEnemies] = useState("");
  const [newAssociates, setNewAssociates] = useState("");
  const [newWeapons, setNewWeapons] = useState("");
  const [newVehicles_Mounts, setNewVehicles_Mounts] = useState("");
  const [newAffiliation, setNewAffiliation] = useState("");
  const [newAbilities, setNewAbilities] = useState("");
  const [newRace_People, setNewRace_People] = useState("");
  const [newBio_Notes, setNewBio_Notes] = useState("");
  const [CHARINFO, setCHARINFO] = useState({});

  const [userUID, setUserUID] = useState("");

  function newNameInputHandler(updatedName) {
    setNewName(updatedName);
  }

  function newProfessionInputHandler(updatedProfession) {
    setNewProfession(updatedProfession);
  }

  function newAlliesInputHandler(updated) {
    setNewAllies(updated);
  }

  function newEnemiesInputHandler(updated) {
    setNewEnemies(updated);
  }

  function newAssociatesInputHandler(updated) {
    setNewAssociates(updated);
  }

  function newWeaponsInputHandler(updated) {
    setNewWeapons(updated);
  }

  function newVehicles_MountsInputHandler(updated) {
    setNewVehicles_Mounts(updated);
  }

  function newAffiliationInputHandler(updated) {
    setNewAffiliation(updated);
  }

  function newAbilitiesInputHandler(updated) {
    setNewAbilities(updated);
  }

  function newRace_PeopleInputHandler(updated) {
    setNewRace_People(updated);
  }

  function newBio_NotesInputHandler(updated) {
    setNewBio_Notes(updated);
  }

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        ogDocInfo = await getCharDetails(userUID, title, name, setCHARINFO); //so that we wait to get the info we need for later
        console.log("ogDocInfo: " + ogDocInfo[0] + " and " + ogDocInfo[1]);
      })();
    }, [userUID])
  );

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      prePopulate();
    }, [CHARINFO])
  );

  const updateChar = async () => {
    //only change the fields modified in this screen, leave the other(s) the same
    console.log("updating Character in " + title);
    var continueGoing = true;
    if (newName !== CHARINFO.Name) {
      console.log("checking if the new name is valid " + newName);
      const queryTitleID = query(
        collection(db, userUID),
        where("Title", "==", title)
      );
      const titleSnapshot = await getDocs(queryTitleID);
      var id = "";
      titleSnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        id = doc.data().id;
      });
      const q = query(
        collection(db, userUID, id, "Characters"),
        where("Name", "==", newName)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        console.log("have found a match.");
        if (doc.exists()) {
          //name already exists so is invalid
          console.log("Invalid name. Character Already Exists!!");
          //TODO: add some sort of alert/popup in app
          continueGoing = false;
          return;
        }
      });
    }
    console.log("GOING TO UPDATE");
    if (continueGoing) {
      //regardless of if a new name was given or not update anything if changed
      console.log("U P D A T I N G  T H E  D O C U M E N T");
      const ogDocRef = doc(
        db,
        userUID,
        ogDocInfo[0],
        "Characters",
        ogDocInfo[1]
      );
      console.log("Updating " + ogDocRef + " and there it is");
      console.log("type of ogDocRef: " + typeof ogDocRef);
      console.log("WEAPONS: " + newWeapons);
      updateDoc(ogDocRef, {
        Name: newName,
        Profession: newProfession,
        Allies: newAllies,
        Enemies: newEnemies,
        Associates: newAssociates,
        Weapons: newWeapons,
        Vehicles_Mounts: newVehicles_Mounts,
        Affiliation: newAffiliation,
        Abilities: newAbilities,
        Race_People: newRace_People,
        Bio_Notes: newBio_Notes,
      });
    }

    navigation.navigate("CharactersPage", { title: title });
  };

  //put what has already been added into each field so user can truly update and not just overwrite
  function prePopulate() {
    console.log("PREPOPULATING");
    console.log(CHARINFO);
    setNewName(CHARINFO.Name);
    setNewProfession(CHARINFO.Profession);
    setNewAllies(CHARINFO.Allies);
    setNewEnemies(CHARINFO.Enemies);
    setNewAssociates(CHARINFO.Associates);
    setNewWeapons(CHARINFO.Weapons);
    setNewVehicles_Mounts(CHARINFO.Vehicles_Mounts);
    setNewAffiliation(CHARINFO.Affiliation);
    setNewAbilities(CHARINFO.Abilities);
    setNewRace_People(CHARINFO.Race_People);
    setNewBio_Notes(CHARINFO.Bio_Notes);
  }

  return (
    <View>
      <Text>UpdateCharacter</Text>
      <TextInput
        placeholder={"Name: " + CHARINFO.Name}
        onChangeText={newNameInputHandler}
        value={newName}
      />
      <TextInput
        placeholder={
          CHARINFO.Profession === ""
            ? "Profession"
            : "Profession: " + CHARINFO.Profession
        }
        onChangeText={newProfessionInputHandler}
        value={newProfession}
      />
      <TextInput
        placeholder={
          CHARINFO.Allies === "" ? "Allies" : "Allies: " + CHARINFO.Allies
        }
        onChangeText={newAlliesInputHandler}
        value={newAllies}
      />
      <TextInput
        placeholder={
          CHARINFO.Enemies === "" ? "Enemies" : "Enemies: " + CHARINFO.Enemies
        }
        onChangeText={newEnemiesInputHandler}
        value={newEnemies}
      />
      <TextInput
        placeholder={
          CHARINFO.Associates === "" ? "Associates" : CHARINFO.Associates
        }
        onChangeText={newAssociatesInputHandler}
        value={newAssociates}
      />
      <TextInput
        placeholder={CHARINFO.Weapons === "" ? "Weapons" : CHARINFO.Weapons}
        onChangeText={newWeaponsInputHandler}
        value={newWeapons}
      />
      <TextInput
        placeholder={
          CHARINFO.Vehicles_Mounts === ""
            ? "Vehicle/Mount(s)"
            : CHARINFO.Vehicles_Mounts
        }
        onChangeText={newVehicles_MountsInputHandler}
        value={newVehicles_Mounts}
      />
      <TextInput
        placeholder={
          CHARINFO.Affiliation === "" ? "Affiliation" : CHARINFO.Affiliation
        }
        onChangeText={newAffiliationInputHandler}
        value={newAffiliation}
      />
      <TextInput
        placeholder={
          CHARINFO.Abilities === "" ? "Abilities" : CHARINFO.Abilities
        }
        onChangeText={newAbilitiesInputHandler}
        value={newAbilities}
      />
      <TextInput
        placeholder={
          CHARINFO.Race_People === "" ? "Race/People" : CHARINFO.Race_People
        }
        onChangeText={newRace_PeopleInputHandler}
        value={newRace_People}
      />
      {/*TODO: make it so long text is more readable as you enter it- PROBABLY ALSO APPLIES TO AddCharacter */}
      <TextInput
        placeholder={
          CHARINFO.Bio_Notes === "" ? "Bio/Notes" : CHARINFO.Bio_Notes
        }
        onChangeText={newBio_NotesInputHandler}
        value={newBio_Notes}
        multiline={true}
      />
      <Button title="Submit" onPress={updateChar} />
      <Button
        title="Cancel"
        onPress={() =>
          navigation.navigate("CharacterDetails", { title: title, name: name })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({});
