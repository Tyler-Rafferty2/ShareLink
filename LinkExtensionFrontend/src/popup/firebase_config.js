import { initializeApp } from 'firebase/app';

// TODO Fill Me! 
// Find my details from Firebase Console

// config after registering firebase App 
const config = {
    apiKey: "AIzaSyAlSlR-xm3wzJeFi2CN-i2VYKmVmp5kmBY",
    authDomain: "linkextension-faf2c.firebaseapp.com",
    projectId: "linkextension-faf2c",
    storageBucket: "linkextension-faf2c.firebasestorage.app",
    messagingSenderId: "667607585616",
    appId: "1:667607585616:web:6a3538067dd5bd40165255",
    measurementId: "G-BXLE3ET6ME"
};  

// This creates firebaseApp instance
// version: SDK 9
const firebaseApp = initializeApp(config)

export{
    firebaseApp
}