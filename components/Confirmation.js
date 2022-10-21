import { StyleSheet, Text, View, Modal, Pressable } from "react-native";
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
          <View style={styles.buttonsContainer}>
            <View style={[styles.confirmButtonBody, props.confirmColor]}>
              <Pressable
                android_ripple={{ color: "#dddddd" }}
                onPress={props.onConfirm}
                style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </Pressable>
            </View>
            <View style={styles.cancelButtonBody}>
              <Pressable
                android_ripple={{ color: "#dddddd" }}
                onPress={props.onCancel}
                style={({ pressed }) => pressed && styles.pressedButton} //if true returns this styling
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    backgroundColor: "#f9a603",
    borderColor: "#fb6542",
    padding: 5,
    borderRadius: 10,
    borderWidth: 10,
  },
  buttonsContainer: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  message: {
    flex: 0,
    textAlign: "center",
    color: "black",
  },
  outer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pressedButton: {
    opacity: 0.5,
  },
  confirmButtonText: {
    padding: 8,
    alignSelf: "center",
    color: "black",
  },
  confirmButtonBody: {
    margin: 5,
    borderRadius: 6,
    //backgroundColor: "#86ac41",
  },
  cancelButtonText: {
    padding: 8,
    alignSelf: "center",
    color: "black",
  },
  cancelButtonBody: {
    margin: 5,
    borderRadius: 6,
    backgroundColor: "#86ac41",
  },
});
