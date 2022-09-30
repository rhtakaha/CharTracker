//file to put shared functions to reduce bloat and make things more modifiable
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase_config";

//function that gets the signed in user's UID and puts it into the state variable
export const getAuthenticationInfo = async (setUserUID) => {
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
