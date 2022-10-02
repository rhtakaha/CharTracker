import { StyleSheet, Text, View, Modal, Button } from "react-native";
import React from "react";

export default function Confirmation(props) {
  return (
    <Modal visible={props.visible} animationType="slide">
      <View>
        <Text>{props.text}</Text>
        <View style={styles.buttonContainer}>
          <Button title="Confirm" onPress={props.onConfirm} />
          <Button title="Cancel" onPress={props.onCancel} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
  },
});
