const firebase =  require("firebase/app");
require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyAWOS82XEel3F3oY36BHDMwOhOren62PR8",
    authDomain: "localcubedata.firebaseapp.com",
    projectId: "localcubedata",
    storageBucket: "localcubedata.appspot.com",
    messagingSenderId: "869499316871",
    appId: "1:869499316871:web:faa2a74b8cabd6f0bd6622",
    measurementId: "G-CPYFVDHFK6"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

module.exports = { db };