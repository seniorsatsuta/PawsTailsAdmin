// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.API_FIREBASE,
    authDomain: "next-ecommerce-385915.firebaseapp.com",
    projectId: "next-ecommerce-385915",
    storageBucket: "next-ecommerce-385915.appspot.com",
    messagingSenderId: "743937565799",
    appId: "1:743937565799:web:b23597cee4da16dac720c2",
    measurementId: "G-SYGSDKJ8MG"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const firebaseStorage = getStorage(firebaseApp);

export default firebaseStorage;