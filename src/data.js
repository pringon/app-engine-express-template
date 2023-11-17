import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore/lite'

export function getDatabase(firebaseKey) {
    if (!firebaseKey) {
        return {
            backend: "mem",
        }
    }
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_KEY,
        authDomain: "urbanlab-4afdd.firebaseapp.com",
        projectId: "urbanlab-4afdd",
        storageBucket: "urbanlab-4afdd.appspot.com",
        messagingSenderId: "278086436354",
        appId: "1:278086436354:web:a760b19abe05980498091b",
    }
    const firebase = initializeApp(firebaseConfig)
    const db = getFirestore(firebase)
    return {
        backend: "firebase",
        driver: db,
    }
}
