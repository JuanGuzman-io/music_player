import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyCXjOVwh8j07NliQZp5aBDvGsLrdqu8Jyo",
    authDomain: "music-player-5e97e.firebaseapp.com",
    projectId: "music-player-5e97e",
    storageBucket: "music-player-5e97e.appspot.com",
    messagingSenderId: "569379603417",
    appId: "1:569379603417:web:ed76f5ed53a2cc66720fc8"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);