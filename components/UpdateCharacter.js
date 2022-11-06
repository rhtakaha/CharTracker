import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { db } from "../firebase/firebase_config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore/lite";
import { useFocusEffect } from "@react-navigation/native";
import {
  getAuthenticationInfo,
  getCharDetails,
  uploadImage,
  deleteImage,
  downloadImage,
} from "../shared";
import * as ImagePicker from "expo-image-picker";

var ogDocInfo = [];
let submitting = false;
export default function UpdateCharacter({ route, navigation }) {
  const { title, titleId, charId } = route.params;
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
  const [image, setImage] = useState(null);
  const [imageDeleted, setImageDeleted] = useState(false);

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
        ogDocInfo = await getCharDetails(userUID, titleId, charId, setCHARINFO); //so that we wait to get the info we need for later
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

  useFocusEffect(
    React.useCallback(() => {
      updateCharacter();
    }, [image])
  );

  //method to upload which should be called after the image is changed and only happen just after the submit button was pressed
  const updateCharacter = async () => {
    console.log("TRIGGERED update char: " + submitting);
    if (submitting) {
      const ogDocRef = doc(
        db,
        userUID,
        ogDocInfo[0],
        "Characters",
        ogDocInfo[1]
      );
      if (imageDeleted) {
        //if the image has been deleted and not replaced
        await updateDoc(ogDocRef, {
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
          image: "",
        });
      } else {
        //if the image has been replaced or not deleted (thus maintained)
        await updateDoc(ogDocRef, {
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
          image: image ? image : CHARINFO.image,
        });
      }
      console.log("updated char with proper https link image");
      submitting = false;
      navigation.navigate("CharactersPage", { title: title, titleId: titleId });
    }
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
      setImageDeleted(false);
    }
  };

  const updateChar = async () => {
    //only change the fields modified in this screen, leave the other(s) the same
    console.log("updating Character in " + title);
    var continueGoing = true;
    if (newName !== CHARINFO.Name) {
      console.log("checking if the new name is valid " + newName);
      const q = query(
        collection(db, userUID, titleId, "Characters"),
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
      updateCharImage();
      // if (imageDeleted) {
      //   //if the image has been deleted and not replaced
      //   await updateDoc(ogDocRef, {
      //     Name: newName,
      //     Profession: newProfession,
      //     Allies: newAllies,
      //     Enemies: newEnemies,
      //     Associates: newAssociates,
      //     Weapons: newWeapons,
      //     Vehicles_Mounts: newVehicles_Mounts,
      //     Affiliation: newAffiliation,
      //     Abilities: newAbilities,
      //     Race_People: newRace_People,
      //     Bio_Notes: newBio_Notes,
      //     image: "",
      //   });
      // } else {
      //   //if the image has been replaced or not deleted/maintained
      //   await updateDoc(ogDocRef, {
      //     Name: newName,
      //     Profession: newProfession,
      //     Allies: newAllies,
      //     Enemies: newEnemies,
      //     Associates: newAssociates,
      //     Weapons: newWeapons,
      //     Vehicles_Mounts: newVehicles_Mounts,
      //     Affiliation: newAffiliation,
      //     Abilities: newAbilities,
      //     Race_People: newRace_People,
      //     Bio_Notes: newBio_Notes,
      //     image: image ? image : CHARINFO.image,
      //   });
      // }
    }
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

  //not sure why but putting this in a function and calling it makes the UI more responsive (no page refresh to see images?)
  const updateCharImage = async () => {
    if (image !== null) {
      await uploadImage(userUID, image, charId);
      setImage(await downloadImage(userUID, charId));
      submitting = true;
    } else if (imageDeleted) {
      //if the image is deleted then we need to trigger the document update on submit
      submitting = true;
      updateCharacter();
    }
  };

  //TODO: ALSO NEED TO DELETE image FROM DOCUMENT
  const deleteCharImage = async () => {
    deleteImage(userUID, charId);
    setImage(null);
    setImageDeleted(true);
  };

  function removePickedImage() {
    setImage(null);
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.image}>
          {CHARINFO.image && (
            <Image
              source={{ uri: CHARINFO.image }}
              style={{ width: 100, height: 100 }}
            />
          )}
        </View>

        <TextInput
          placeholder={"Name: " + CHARINFO.Name}
          onChangeText={newNameInputHandler}
          value={newName}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder={
            CHARINFO.Profession === ""
              ? "Profession"
              : "Profession: " + CHARINFO.Profession
          }
          onChangeText={newProfessionInputHandler}
          value={newProfession}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder={
            CHARINFO.Allies === "" ? "Allies" : "Allies: " + CHARINFO.Allies
          }
          onChangeText={newAlliesInputHandler}
          value={newAllies}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder={
            CHARINFO.Enemies === "" ? "Enemies" : "Enemies: " + CHARINFO.Enemies
          }
          onChangeText={newEnemiesInputHandler}
          value={newEnemies}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder={
            CHARINFO.Associates === "" ? "Associates" : CHARINFO.Associates
          }
          onChangeText={newAssociatesInputHandler}
          value={newAssociates}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder={CHARINFO.Weapons === "" ? "Weapons" : CHARINFO.Weapons}
          onChangeText={newWeaponsInputHandler}
          value={newWeapons}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder={
            CHARINFO.Vehicles_Mounts === ""
              ? "Vehicle/Mount(s)"
              : CHARINFO.Vehicles_Mounts
          }
          onChangeText={newVehicles_MountsInputHandler}
          value={newVehicles_Mounts}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder={
            CHARINFO.Affiliation === "" ? "Affiliation" : CHARINFO.Affiliation
          }
          onChangeText={newAffiliationInputHandler}
          value={newAffiliation}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder={
            CHARINFO.Abilities === "" ? "Abilities" : CHARINFO.Abilities
          }
          onChangeText={newAbilitiesInputHandler}
          value={newAbilities}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder={
            CHARINFO.Race_People === "" ? "Race/People" : CHARINFO.Race_People
          }
          onChangeText={newRace_PeopleInputHandler}
          value={newRace_People}
          style={styles.inputContainer}
        />
        <TextInput
          placeholder={
            CHARINFO.Bio_Notes === "" ? "Bio/Notes" : CHARINFO.Bio_Notes
          }
          onChangeText={newBio_NotesInputHandler}
          value={newBio_Notes}
          multiline={true}
          style={styles.inputContainer}
        />
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{ color: "#dddddd" }}
            onPress={deleteCharImage}
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
            <Text style={styles.buttonText}>
              Pick an image from camera roll
            </Text>
          </Pressable>
        </View>
        <View style={styles.image}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{ color: "#dddddd" }}
            onPress={updateChar}
            style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
          >
            <Text style={styles.buttonText}>Submit</Text>
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{ color: "#dddddd" }}
            onPress={() =>
              navigation.navigate("CharacterDetails", {
                title: title,
                titleId: titleId,
                charId: charId,
              })
            }
            style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003B46",
    justifyContent: "center",
  },
  buttonContainer: { margin: 5, borderRadius: 6, backgroundColor: "#86ac41" },
  buttonText: { padding: 8, alignSelf: "center", color: "black" },
  pressedButton: {
    opacity: 0.5,
  },
  image: {
    alignSelf: "center",
  },
  inputContainer: {
    backgroundColor: "#c4dfe6",
    minWidth: 200,
    maxWidth: 400,
    margin: 5,
    padding: 5,
    borderRadius: 4,
    alignSelf: "center",
  },
});
