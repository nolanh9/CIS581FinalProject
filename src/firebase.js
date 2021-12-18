// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY_DEV,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN_DEV,
    projectId: process.env.REACT_APP_PROJECT_ID_DEV,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET_DEV,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID_DEV,
    appId: process.env.REACT_APP_APP_ID_DEV,
    measurementId: process.env.REACT_APP_MEASUREMENT_ID_DEV
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);