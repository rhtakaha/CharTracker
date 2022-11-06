import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
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
import { getAuthenticationInfo, uploadImage, downloadImage } from "../shared";
import * as ImagePicker from "expo-image-picker";
import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from "react-native-google-mobile-ads";
import { SafeAreaView } from "react-native-safe-area-context";
var uuid = require("uuid");

///
let submitting = false;
let newId; ///
export default function AddCharacters({ route, navigation }) {
  const { title, titleId } = route.params;

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
  let [image, setImage] = useState(null);

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

  ///
  useFocusEffect(
    React.useCallback(() => {
      uploadCharacter();
    }, [image])
  );

  //method to upload which should be called after the image is changed and only happen just after the submit button was pressed
  const uploadCharacter = async () => {
    console.log("TRIGGERED on char: " + submitting);
    if (submitting) {
      console.log("newId: " + newId);
      await setDoc(doc(db, userUID, titleId, "Characters", newId), {
        Name: enteredName,
        id: newId,
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
        image: image ? image : "",
      });
      console.log("uploaded character with proper https link");
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
      //TODO: REMOVE?
      setImage(result.uri);
    }
  };

  const isCharIdUnique = async (db, userUID, newId) => {
    const docRef = doc(db, userUID, titleId, "Characters", newId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return false;
    }
    return true;
  };

  const isCharNameUnique = async (userUID, name) => {
    const q = query(
      collection(db, userUID, titleId, "Characters"),
      where("Name", "==", name)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  };

  const setChar = async () => {
    if (enteredName !== "") {
      console.log("starting set Character");
      if (!(await isCharNameUnique(userUID, enteredName))) {
        //not unique name so block
        console.log("Invalid name. Already in use.");
      } else {
        //valid name
        //keep generating ids until get a unique one (should be first time but to be sure)
        do {
          newId = uuid.v4();
        } while (!(await isCharIdUnique(db, userUID, newId)));

        //have the id so create the character
        console.log("Adding new Character");
        console.log("newId: " + newId);

        if (image !== null) {
          //  Immediately download so can set the url in the document to be the https url to the cloud and not to local storage
          await uploadImage(userUID, image, newId);
          setImage(await downloadImage(userUID, newId));
          submitting = true;
        }
      }
    } else {
      console.log("NAME REQUIRED, NOT ENTERED");
    }
  };

  function removePickedImage() {
    setImage(null);
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.container}>
          <TextInput
            placeholder="Name (full)"
            onChangeText={nameInputHandler}
            value={enteredName}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Profession"
            onChangeText={professionInputHandler}
            value={enteredProfession}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Allies"
            onChangeText={alliesInputHandler}
            value={enteredAllies}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Enemies"
            onChangeText={enemiesInputHandler}
            value={enteredEnemies}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Associates"
            onChangeText={associatesInputHandler}
            value={enteredAssociates}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Weapons"
            onChangeText={weaponsInputHandler}
            value={enteredWeapons}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Vehicle/Mount(s)"
            onChangeText={vehicles_MountsInputHandler}
            value={enteredVehicle_Mounts}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Affiliation"
            onChangeText={affiliationInputHandler}
            value={enteredAffiliation}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Abilities"
            onChangeText={abilitiesInputHandler}
            value={enteredAbilities}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Race/People"
            onChangeText={race_PeopleInputHandler}
            value={enteredRace_People}
            style={styles.inputContainer}
          />
          <TextInput
            placeholder="Bio/Notes"
            onChangeText={bio_NotesInputHandler}
            value={enteredBio_Notes}
            style={styles.inputContainer}
            multiline={true}
          />
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
          {/*///maybe add ability to remove the image you picked (for ending with no image?) */}
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
              onPress={setChar}
              style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
            >
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              android_ripple={{ color: "#dddddd" }}
              onPress={() =>
                navigation.navigate("CharactersPage", {
                  title: title,
                  titleId: titleId,
                })
              }
              style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <BannerAd
        unitId={TestIds.BANNER}
        size={BannerAdSize.LARGE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </SafeAreaView>
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
    minWidth: 200,
    maxWidth: 400,
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
