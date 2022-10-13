import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

export default function CharacterItem(props) {
  return (
    <View style={styles.titleItem}>
      <Pressable
        android_ripple={{ color: "#dddddd" }}
        onPress={props.goToDetails.bind(this, props.charId)}
        style={({ pressed }) => pressed && styles.pressedItem} //if true returns this styling
      >
        <Text style={styles.titleText}>{props.name}</Text>
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
  },
  pressedItem: {
    opacity: 0.5,
  },
});
