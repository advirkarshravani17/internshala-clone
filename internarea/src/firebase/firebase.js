// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYoCPbkz_6CguvlSy3ndOetJ8JB9Bek0c",
  authDomain: "internarea-73cc2.firebaseapp.com",
  projectId: "internarea-73cc2",
  storageBucket: "internarea-73cc2.firebasestorage.app",
  messagingSenderId: "875293307136",
  appId: "1:875293307136:web:af96602c14f4ae1e1cc3e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
