import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebase_config";
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
import { onAuthStateChanged } from "firebase/auth";
import { getAuthenticationInfo } from "../shared";

//var CHARINFO = [];
var ogDocRef = "";
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

  //   useEffect(() => {
  //     getCharacterDetails();
  //   });

  useFocusEffect(
    React.useCallback(() => {
      getCharacterDetails();
    }, [userUID])
  );

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
    }, [])
  );

  // //TODO: repetitive function, there has to be a way to import/export/ use functions between files
  // const getAuthenticationInfo = async () => {
  //   console.log("getting user data!");
  //   onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       //user is signed in
  //       console.log("user signed in. UID: " + user.uid);
  //       setUserUID(user.uid);
  //       return;
  //     } else {
  //       //not signed in which would not practically happen
  //     }
  //   });
  // };

  //TODO: this method is virtually identical to the getCharDetails one in CharacterDetails.js, probably figure out a way to generalize and import
  const getCharacterDetails = async () => {
    if (userUID !== "") {
      console.log("Getting character data for updating.");
      const q = query(collection(db, userUID), where("Title", "==", title));
      const querySnapshot = await getDocs(q);
      var titleId = "";
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        titleId = doc.data().id;
      });

      const q2 = query(
        collection(db, userUID, titleId, "Characters"),
        where("Name", "==", name)
      );
      const querySnapshot2 = await getDocs(q2);
      var charId = "";
      querySnapshot2.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        charId = doc.data().id;
      });

      ogDocRef = doc(db, userUID, titleId, "Characters", charId);
      const docSnap = await getDoc(ogDocRef);

      if (docSnap.exists()) {
        console.log("Found the character details");
        //CHARINFO = docSnap.data();
        setCHARINFO(docSnap.data());
        console.log("char details:");
        console.log(CHARINFO);
        console.log("testing: " + CHARINFO.Name);
      } else {
        console.log("lost the character");
        //something went wrong
      }
    }
  };

  const updateChar = async () => {
    //only change the fields modified in this screen, leave the other(s) the same
    console.log("updating Character in " + title);
    var continueGoing = true;
    if (newName !== "") {
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
    if (continueGoing) {
      //regardless of if a new name was given or not update anything if changed
      console.log("Updating " + ogDocRef + " and there it is");
      updateDoc(ogDocRef, {
        Name: newName === "" ? CHARINFO.Name : newName,
        Profession: newProfession === "" ? CHARINFO.Profession : newProfession,
        Allies: newAllies === "" ? CHARINFO.Allies : newAllies,
        Enemies: newEnemies === "" ? CHARINFO.Enemies : newEnemies,
        Associates: newAssociates === "" ? CHARINFO.Associates : newAssociates,
        Weapons: newWeapons === "" ? CHARINFO.Weapons : newWeapons,
        Vehicles_Mounts:
          newVehicles_Mounts === ""
            ? CHARINFO.Vehicles_Mounts
            : newVehicles_Mounts,
        Affiliation:
          newAffiliation === "" ? CHARINFO.Affiliation : newAffiliation,
        Abilities: newAbilities === "" ? CHARINFO.Abilities : newAbilities,
        Race_People:
          newRace_People === "" ? CHARINFO.Race_People : newRace_People,
        Bio_Notes: newBio_Notes === "" ? CHARINFO.Bio_Notes : newBio_Notes,
      });
    }

    navigation.navigate("CharactersPage", { title: title });
  };

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
        placeholder={CHARINFO.Allies === "" ? "Allies" : CHARINFO.Allies}
        onChangeText={newAlliesInputHandler}
        value={newAllies}
      />
      <TextInput
        placeholder={CHARINFO.Enemies === "" ? "Enemies" : CHARINFO.Enemies}
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
      <TextInput
        placeholder={
          CHARINFO.Bio_Notes === "" ? "Bio/Notes" : CHARINFO.Bio_Notes
        }
        onChangeText={newBio_NotesInputHandler}
        value={newBio_Notes}
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
