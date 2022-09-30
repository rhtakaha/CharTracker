//file to put shared functions to reduce bloat and make things more modifiable
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "./firebase/firebase_config";
import {
  query,
  getDocs,
  where,
  doc,
  collection,
  getDoc,
} from "firebase/firestore/lite";

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

export const getCharDetails = async (userUID, title, name, setDETAILS) => {
  if (userUID !== "") {
    console.log("starting to get the data from " + title + " about " + name);
    const q = query(collection(db, userUID), where("Title", "==", title));
    const querySnapshot = await getDocs(q);
    var titleId = "";
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      titleId = doc.data().id;
    });

    const q2 = query(
      collection(db, userUID, titleId, "Characters"),
      where("Name", "==", name)
    );
    const querySnapshot2 = await getDocs(q2);
    var charId = "";
    querySnapshot2.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      charId = doc.data().id;
    });

    const docRef = doc(db, userUID, titleId, "Characters", charId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Found the character details");
      setDETAILS(docSnap.data());
    } else {
      console.log("lost the character");
      //something went wrong
    }
  }
  return [titleId, charId];
};
