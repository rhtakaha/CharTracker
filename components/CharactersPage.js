import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  StatusBar,
  Button,
} from "react-native";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where,
} from "firebase/firestore/lite";
import CharacterItem from "./CharacterItem";
import React, { useState } from "react";
import { db } from "../firebase/firebase_config";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthenticationInfo } from "../shared";

export default function CharactersPage({ route, navigation }) {
  const { title } = route.params;
  const [CHARS, setCHARS] = useState({});
  const [userUID, setUserUID] = useState("");

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

  function goToCharDetails(givenName) {
    //passes the title and the character name onto details page
    console.log(givenName);
    navigation.navigate("CharacterDetails", { title: title, name: givenName });
  }

  const renderItem = ({ item }) => (
    <CharacterItem name={item.Name} goToDetails={goToCharDetails} />
  );

  const getChars = async () => {
    if (userUID !== "") {
      console.log("starting to get the data from " + title);

      const q = query(collection(db, userUID), where("Title", "==", title));
      const querySnapshot = await getDocs(q);
      var id = "";
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        id = doc.data().id;
      });
      console.log("id: " + id);

      const titleCol = collection(db, userUID, id, "Characters");
      const titleSnapshot = await getDocs(titleCol);

      setCHARS(titleSnapshot.docs.map((doc) => doc.data()));
      console.log("finished collecting data");
      console.log(CHARS);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text>CharactersPage</Text>
      <Text>{title}</Text>
      <Button
        title="Add Character"
        onPress={() => navigation.navigate("AddCharacters", { title: title })}
      />
      <Button
        title="Update Title"
        onPress={() => navigation.navigate("UpdateTitle", { title: title })}
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
    marginTop: StatusBar.currentHeight || 0,
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
});
