import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBz0mn92VagynSWDAwd0rvKPr8uZDfMupw",
  authDomain: "candyshop-3a788.firebaseapp.com",
  projectId: "candyshop-3a788",
  storageBucket: "candyshop-3a788.appspot.com",
  messagingSenderId: "864697354101",
  appId: "1:864697354101:web:33f7616b94842042f8f53c"
});

export default firebaseApp;
