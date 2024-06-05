const firebase = require("firebase/app");
const firestore= require("firebase/firestore");
const auth = require("@firebase/auth");
// const {
//   FIREBASE_API_KEY, 
//   FIREBASE_AUTH_DOMAIN,
//   FIREBASE_PROJECTID, 
//   FIREBASE_STORAGE_BUCKET, 
//   FIREBASE_MESSAGING_SENDER_ID,
//   FIREBASE_APP_ID,
//   FIREBASE_MEASUREMENT_ID
// } = process.env;

// const firebaseConfig = {
//   apiKey: FIREBASE_API_KEY,
//   authDomain: FIREBASE_AUTH_DOMAIN,
//   projectId: FIREBASE_PROJECTID,
//   storageBucket: FIREBASE_STORAGE_BUCKET, 
//   messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
//   appId: FIREBASE_APP_ID,
//   measurementId: FIREBASE_MEASUREMENT_ID
// };

const firebaseConfig = {
  apiKey: "AIzaSyDUWJHv10Qbc48I9XXBjaJ8miNPUuAenMw",
  authDomain: "wanderlust-aa90f.firebaseapp.com",
  projectId: "wanderlust-aa90f",
  storageBucket: "wanderlust-aa90f.appspot.com",
  messagingSenderId: "1007445324334",
  appId: "1:1007445324334:web:76b2ca35a255fadbc325bf",
  measurementId: "G-H5ZSR1YBNW"
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

initializeFirebaseApp();
module.exports= {
  firestore,
  auth
}