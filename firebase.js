import {initializeApp} from "firebase/app"
import {getFirestore} from "firebase/firestore"
import {getAuth} from "firebase/auth"
import {getDatabase} from "firebase/database"


const firebaseConfig = {
  apiKey: "AIzaSyBDUoUt0zuywU334nbIyZYLnMGq7EMjfg0",
  authDomain: "bangla-abusive-word-detection.firebaseapp.com",
  databaseURL: "https://bangla-abusive-word-detection-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bangla-abusive-word-detection",
  storageBucket: "bangla-abusive-word-detection.appspot.com",
  messagingSenderId: "190451767087",
  appId: "1:190451767087:web:cb79aa326def743ac533da",
  measurementId: "G-0T292JH8NP"
};


const app = initializeApp(firebaseConfig);


const db_firestore = getFirestore(app);
const db_realtime = getDatabase(app);
const auth = getAuth(app);

export {db_firestore, db_realtime, app, auth};

