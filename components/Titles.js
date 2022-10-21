import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { collection, getDocs } from "firebase/firestore/lite";
import { db } from "../firebase/firebase_config";
import TitleItem from "./TitleItem";
import { useFocusEffect } from "@react-navigation/native";
import { getAuthenticationInfo } from "../shared";
import { downloadImage } from "../shared";
import { checkCached } from "../shared";

export default function Titles({ navigation }) {
  const [DATA, setDATA] = useState({});
  const [userUID, setUserUID] = useState("");

  function goToCharsPage(givenTitle, givenId) {
    //function that takes
    navigation.navigate("CharactersPage", {
      title: givenTitle,
      titleId: givenId,
    });
  }
  const renderItem = ({ item }) => (
    <TitleItem
      text={item.Title}
      Id={item.id}
      image={item.image}
      goToChars={goToCharsPage}
    />
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

        setDATA(dummySnapshot.docs.map((doc) => doc.data()));
        console.log("collected data:");
        console.log(JSON.stringify(DATA) + "\n");
        //now that we have all the title data
        //check if each image is in the cache, if not then download and add to cache
        for (const item in DATA) {
          console.log("Image: " + DATA[item].image);
          if (DATA[item].image !== undefined) {
            //if there is an associated image

            console.log("cached: " + (await checkCached(DATA[item].image)));
            if ((await checkCached(DATA[item].image)) !== "memory") {
              //if image is not cached then download and cache
              console.log("downloading");
              await downloadImage(userUID, DATA[item].id);
            }
          }
        }
      } else {
        // 0 documents means no collection so will need to make the collection with the first title, nothing to be done here
      }
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAuthenticationInfo(setUserUID);
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      getTitles();
    }, [userUID])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonBody}>
        <Pressable
          android_ripple={{ color: "#dddddd" }}
          onPress={() => navigation.navigate("AddTitles")}
          style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
        >
          <Text style={styles.buttonText}>Add a Title</Text>
        </Pressable>
      </View>

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
    backgroundColor: "#003B46",
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
  pressedButton: {
    opacity: 0.5,
  },
  buttonText: {
    padding: 8,
    alignSelf: "center",
    color: "black",
  },
  buttonBody: {
    margin: 9,
    borderRadius: 6,
    backgroundColor: "#86ac41",
  },
});
