import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUnwfRi1PZ4OMt14OLacLRJo7wWuLnI5U",
  authDomain: "tiktik-hackathon.firebaseapp.com",
  projectId: "tiktik-hackathon",
  storageBucket: "tiktik-hackathon.appspot.com",
  messagingSenderId: "638097584204",
  appId: "1:638097584204:web:cbf9194841f693565cc4e9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
