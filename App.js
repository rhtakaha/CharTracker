import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { auth, db } from "./firebase/firebase_config";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./components/Home";
import Titles from "./components/Titles";
import AddTitle from "./components/AddTitle";
import CharactersPage from "./components/CharactersPage";
import AddCharacters from "./components/AddCharacters";
import CharactersDetails from "./components/CharacterDetails";
import UpdateTitle from "./components/UpdateTitle";
import UpdateCharacter from "./components/UpdateCharacter";

// function HomeScreen({ navigation }) {
//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>Home Screen</Text>
//       <Button
//         title="Go to Details"
//         onPress={() => navigation.navigate("Details")}
//       />
//     </View>
//   );
// }

// function DetailsScreen() {
//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <Text>Details Screen</Text>
//     </View>
//   );
// }
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Overview" }}
        />
        <Stack.Screen name="Titles" component={Titles} />
        <Stack.Screen name="AddTitles" component={AddTitle} />
        <Stack.Screen name="CharactersPage" component={CharactersPage} />
        <Stack.Screen name="AddCharacters" component={AddCharacters} />
        <Stack.Screen name="CharacterDetails" component={CharactersDetails} />
        <Stack.Screen name="UpdateTitle" component={UpdateTitle} />
        <Stack.Screen name="UpdateCharacter" component={UpdateCharacter} />
      </Stack.Navigator>
      {/* <View style={styles.container}>
        <Text>Open up App.js to start working on your app! fr fr?</Text>
        <StatusBar style="auto" />
      </View> */}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
