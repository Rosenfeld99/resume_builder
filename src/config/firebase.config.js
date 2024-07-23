import { getApps, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCgv28EAsnEPOFXWH9EBdLBzepLSLlG0gs",
  authDomain: "resume-builder-d6aa9.firebaseapp.com",
  projectId: "resume-builder-d6aa9",
  storageBucket: "resume-builder-d6aa9.appspot.com",
  messagingSenderId: "700244077973",
  appId: "1:700244077973:web:6ba8653a7b21299981da9c",
};

const app = getApps.length > 0 ? getApps() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
