import { StyleSheet } from "react-native";
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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            headerStyle: {
              backgroundColor: "#07575B",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Titles"
          component={Titles}
          options={{
            headerStyle: {
              backgroundColor: "#07575B",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="AddTitles"
          component={AddTitle}
          options={{
            title: "Add Title",
            headerStyle: {
              backgroundColor: "#07575B",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="CharactersPage"
          component={CharactersPage}
          options={({ route }) => ({
            title: route.params.title,
            headerStyle: {
              backgroundColor: "#07575B",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
        <Stack.Screen
          name="AddCharacters"
          component={AddCharacters}
          options={{
            headerStyle: {
              backgroundColor: "#07575B",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="CharacterDetails"
          component={CharactersDetails}
          options={({ route }) => ({
            title: route.params.name,
            headerStyle: {
              backgroundColor: "#07575B",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
        <Stack.Screen
          name="UpdateTitle"
          component={UpdateTitle}
          options={({ route }) => ({
            title: route.params.title,
            headerStyle: {
              backgroundColor: "#07575B",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
        <Stack.Screen
          name="UpdateCharacter"
          component={UpdateCharacter}
          options={({ route }) => ({
            title: route.params.name,
            headerStyle: {
              backgroundColor: "#07575B",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
