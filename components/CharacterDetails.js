import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthenticationInfo } from "../shared";
import { getCharDetails } from "../shared";
import { deleteDoc, doc } from "firebase/firestore/lite";
import { db } from "../firebase/firebase_config";
import Confirmation from "./Confirmation";

var docInfo = [];
export default function CharacterDetails({ route, navigation }) {
  const { title, titleId, charId } = route.params;
  const [DETAILS, setDETAILS] = useState({});
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
      //getCharDetails(userUID, title, name, setDETAILS);
      (async () => {
        docInfo = await getCharDetails(userUID, titleId, charId, setDETAILS); //so that we wait to get the info we need for later
        console.log("docInfo: " + docInfo[0] + " and " + docInfo[1]);
      })();
    }, [userUID])
  );
  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
    }, [])
  );

  const deleteCharacter = async () => {
    deleteDoc(doc(db, userUID, docInfo[0], "Characters", docInfo[1]));
    navigation.navigate("CharactersPage", { title: title, titleId: titleId });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* <Button
          title="Update Character"
          onPress={() =>
            navigation.navigate("UpdateCharacter", {
              title: title,
              titleId: titleId,
              charId: charId,
            })
          }
        /> */}
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{ color: "#dddddd" }}
            onPress={() =>
              navigation.navigate("UpdateCharacter", {
                title: title,
                titleId: titleId,
                charId: charId,
              })
            }
            style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
          >
            <Text style={styles.buttonText}>Update Character</Text>
          </Pressable>
        </View>
        {/* <Button title="Delete Character" onPress={startConfirmationHandler} /> */}
        <View style={styles.buttonContainer}>
          <Pressable
            android_ripple={{ color: "#dddddd" }}
            onPress={startConfirmationHandler}
            style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
          >
            <Text style={styles.buttonText}>Delete Character</Text>
          </Pressable>
        </View>
        <Confirmation
          text="Are you sure you want to delete this Character?"
          visible={confirmationIsVisible}
          onConfirm={deleteCharacter}
          onCancel={endConfirmationHandler}
          confirmColor={{ backgroundColor: "red" }}
        />
        <View style={styles.image}>
          {DETAILS.image && (
            <Image
              source={{ uri: DETAILS.image }}
              style={{ width: 100, height: 100 }}
            />
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.text}>{"Name: " + DETAILS.Name}</Text>
          <Text style={styles.text}>{"Profession: " + DETAILS.Profession}</Text>
          <Text style={styles.text}>{"Allies: " + DETAILS.Allies}</Text>
          <Text style={styles.text}>{"Enemies: " + DETAILS.Enemies}</Text>
          <Text style={styles.text}>{"Associates: " + DETAILS.Associates}</Text>
          <Text style={styles.text}>{"Weapons: " + DETAILS.Weapons}</Text>
          <Text style={styles.text}>
            {"Vehicle/Mount(s): " + DETAILS.Vehicles_Mounts}
          </Text>
          <Text style={styles.text}>
            {"Affiliation: " + DETAILS.Affiliation}
          </Text>
          <Text style={styles.text}>{"Abilities: " + DETAILS.Abilities}</Text>
          <Text style={styles.text}>
            {"Race/People: " + DETAILS.Race_People}
          </Text>
          <Text style={styles.text}>{"Bio/Notes: " + DETAILS.Bio_Notes}</Text>
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
  textContainer: {
    backgroundColor: "#66A5AD",
    minWidth: 200,
    maxWidth: 400,
    margin: 5,
    padding: 5,
    borderRadius: 4,
    alignSelf: "center",
  },
  text: {
    margin: 5,
  },
});
