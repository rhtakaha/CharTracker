import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Button,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { collection, getDocs, getDoc, doc } from "firebase/firestore/lite";
import { db, auth } from "../firebase/firebase_config";
import TitleItem from "./TitleItem";
import { useFocusEffect } from "@react-navigation/native";
import { onAuthStateChanged } from "firebase/auth";

// const DATA = [
//   {
//     id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
//     Title: "First Item",
//   },
//   {
//     id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
//     Title: "Second Item",
//   },
//   {
//     id: "58694a0f-3da1-471f-bd96-145571e29d72",
//     Title: "Third Item",
//   },
// ];
//var DATA = [];

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

    //unnecessary
    // console.log(DATA);
    // const docRef = doc(db, "Dummy", "GXyxP5NXYa6DNDknQoie");
    // const docSnap = await getDoc(docRef);
    // const docData = docSnap.data();
    // if (docSnap.exists()) {
    //   console.log("Document data:", docData.Title);
    // } else {
    //   // doc.data() will be undefined in this case
    //   console.log("No such document!");
    // }
  };

  //function runs whenever this screen is loaded
  // useLayoutEffect(() => {
  //   getTitles();
  // }, []);
  // useEffect(() => {
  //   getTitles();
  // });
  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo();
      //getTitles();
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      //getAuthenticationInfo();
      getTitles();
    }, [userUID])
  );

  //TODO: repetitive function, there has to be a way to import/export/ use functions between files
  const getAuthenticationInfo = async () => {
    console.log("getting user data!");
    onAuthStateChanged(auth, (user) => {
      if (user) {
        //user is signed in
        console.log("user signed in. UID: " + user.uid);
        setUserUID(user.uid);
        return;
      } else {
        //not signed in which would not practically happen
      }
    });
  };

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
