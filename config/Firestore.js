import { initializeApp } from "firebase/app";
import { collection, addDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC65bzZ5s9Xeo25gFCMnpySmiOqlAnYTpA",
  authDomain: "gofleet-da3d0.firebaseapp.com",
  projectId: "gofleet-da3d0",
  storageBucket: "gofleet-da3d0.appspot.com",
  messagingSenderId: "11369501030",
  appId: "1:11369501030:web:03906932e45621e59ef8a7",
  measurementId: "G-P3LR2V6LK8",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
async function addLocation(rideData) {
  console.log(rideData);
  return addDoc(collection(db, "RidesInfo"), rideData);
}

export { addLocation ,db,app};
