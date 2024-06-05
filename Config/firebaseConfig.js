const firebase = require("firebase/app");
const getFirestore= require("firebase/firestore");
const auth = require("@firebase/auth");
const {
  FIREBASE_API_KEY, 
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECTID, 
  FIREBASE_STORAGE_BUCKET, 
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} = process.env;

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECTID,
  storageBucket: FIREBASE_STORAGE_BUCKET, 
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app;
const initializeFirebaseApp= () =>{
  try{
    app = firebase.initializeApp(firebaseConfig);
    return app;
  } catch(error){
    console.log(error);
  }
} 
const firestore = getFirestore;

initializeFirebaseApp();
module.exports= {
  firestore,
  auth
}