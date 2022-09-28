import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";

export default function TitleItem(props) {
  return (
    <View style={styles.titleItem}>
      <Pressable
        android_ripple={{ color: "#dddddd" }}
        onPress={props.goToChars.bind(this, props.text)}
        style={({ pressed }) => pressed && styles.pressedItem} //if true returns this styling
      >
        <Text style={styles.titleText}>{props.text}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  titleItem: {
    margin: 9,
    borderRadius: 6,
    backgroundColor: "#5e0acc",
  },
  titleText: {
    color: "white",
    padding: 8,
  },
  pressedItem: {
    opacity: 0.5,
  },
});
