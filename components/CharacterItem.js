import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React from "react";

export default function CharacterItem(props) {
  return (
    <View style={styles.titleItem}>
      <Pressable
        android_ripple={{ color: "#dddddd" }}
        onPress={props.goToDetails.bind(this, props.charId)}
        style={({ pressed }) => pressed && styles.pressedItem} //if true returns this styling
      >
        <View style={styles.container}>
          {props.image && (
            <Image
              source={{ uri: props.image }}
              style={{ width: 100, height: 100 }}
            />
          )}
          <Text style={styles.titleText}>{props.name}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titleItem: {
    margin: 9,
    borderRadius: 6,
    backgroundColor: "#66A5AD",
  },
  titleText: {
    color: "black",
    padding: 8,
    alignSelf: "center",
    fontSize: 23,
  },
  pressedItem: {
    opacity: 0.5,
  },
  container: {
    flexDirection: "row",
  },
});
