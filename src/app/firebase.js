// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJLjbeMwIWfH6p74ACEqdvdQFvua4Lla4",
  authDomain: "hackathon-app-time-mangement.firebaseapp.com",
  projectId: "hackathon-app-time-mangement",
  storageBucket: "hackathon-app-time-mangement.appspot.com",
  messagingSenderId: "386121224653",
  appId: "1:386121224653:web:85553f10a84633cadeb484",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const storage = getStorage(app);

export { storage };
