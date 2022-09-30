import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Button,
} from "react-native";
import React, { useState } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore/lite";
import { db } from "../firebase/firebase_config";
import TitleItem from "./TitleItem";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthenticationInfo } from "../shared";

export default function Titles({ navigation }) {
  const [DATA, setDATA] = useState({});
  const [userUID, setUserUID] = useState("");

  function goToCharsPage(givenTitle) {
    //function that takes
    navigation.navigate("CharactersPage", { title: givenTitle });
  }
  const renderItem = ({ item }) => (
    <TitleItem text={item.Title} goToChars={goToCharsPage} />
  );

  const getTitles = async () => {
    //check if the user collection exists or not yet
    if (userUID !== "") {
      ///HACKY WAY OF DOING IT PROBABLY, NEED TO LEARN MORE ABOUT ASYNC

      console.log("userID: " + userUID);
      const col = collection(db, userUID);
      const colSnap = await getDocs(col);
      if (colSnap.docs.length != 0) {
        console.log("starting to get the data!");
        const dummyCol = collection(db, userUID);
        const dummySnapshot = await getDocs(dummyCol);
        //DATA = dummySnapshot.docs.map((doc) => doc.data());
        setDATA(dummySnapshot.docs.map((doc) => doc.data()));
        console.log("collected data:");
        console.log(DATA);
      } else {
        // 0 documents means no collection so will need to make the collection with the first title, nothing to be done here
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
      //getTitles();
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      //getAuthenticationInfo();
      getTitles();
    }, [userUID])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text>Titles</Text>
      <Button title="get Titles" onPress={getTitles} />
      <Button
        title="Add a Title"
        onPress={() => navigation.navigate("AddTitles")}
      />
      <FlatList
        data={DATA}
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
