import { StyleSheet, Text, View, Modal, Button } from "react-native";
import React from "react";

export default function Confirmation(props) {
  return (
    <Modal
      visible={props.visible}
      animationType="slide"
      style={styles.overall}
      transparent={true}
    >
      <View style={styles.outer}>
        <View style={styles.container}>
          <Text style={styles.message}>{props.text}</Text>
          <View style={styles.buttonContainer}>
            <Button title="Confirm" onPress={props.onConfirm} />
            <Button title="Cancel" onPress={props.onCancel} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "green", ///random color, can change later
    borderColor: "green",
    borderRadius: 10,
    borderWidth: 10,
  },
  buttonContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  message: {
    flex: 0,
    textAlign: "center",
  },
  outer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
