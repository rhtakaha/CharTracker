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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Image } from "react-native";

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

export const getCharDetails = async (userUID, titleId, charId, setDETAILS) => {
  if (userUID !== "") {
    //console.log("starting to get the data about " + name);
    // const q = query(collection(db, userUID), where("Title", "==", title));
    // const querySnapshot = await getDocs(q);
    // var titleId = "";
    // querySnapshot.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   titleId = doc.data().id;
    // });

    // const q2 = query(
    //   collection(db, userUID, titleId, "Characters"),
    //   where("Name", "==", name)
    // );
    // const querySnapshot2 = await getDocs(q2);
    // var charId = "";
    // querySnapshot2.forEach((doc) => {
    //   // doc.data() is never undefined for query doc snapshots
    //   charId = doc.data().id;
    // });

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

export const uploadImage = async (userUID, image, newId) => {
  const storage = getStorage();
  console.log("starting image upload\n");
  // Create a reference to where the image should go in firebase storage
  const imageRef = ref(storage, userUID + "/" + newId);
  console.log("references created");
  try {
    uploadBytes(imageRef, await uriToBlob(image)).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
    Image.prefetch(image);
  } catch (error) {
    console.log("ERROR UPLOADING: " + error);
  }
};

const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.onload = function () {
      // return the blob
      console.log("BLOB created!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      resolve(xhr.response);
    };

    xhr.onerror = function () {
      // something went wrong
      reject(new Error("uriToBlob failed"));
    };

    // this helps us get a blob
    xhr.responseType = "blob";

    xhr.open("GET", uri, true);
    xhr.send(null);
  });
};

//TODO: download when necessary (should only be used when the image cannot be found locally [deleted/new device])
//might make images a premium feature since it seems to be more data intensive, but hopefully not
export const downloadImage = async (userUID, titleId /*, setImage*/) => {
  console.log("\nstarting to download image\n");
  const storage = getStorage();
  // Create a reference to the image in firebase storage
  const imageRef = ref(storage, userUID + "/" + titleId);
  console.log("sending req");
  const img = await getDownloadURL(imageRef);
  console.log("received: " + img);
  //setImage(img);
  Image.prefetch(img);
};
