import express from "express"
import makeApi from "./api.js"
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyAjDeHsVil4qwq9IvgS1-qe7dOWBnlYcE4",
  authDomain: "urbanlab-4afdd.firebaseapp.com",
  projectId: "urbanlab-4afdd",
  storageBucket: "urbanlab-4afdd.appspot.com",
  messagingSenderId: "278086436354",
  appId: "1:278086436354:web:a760b19abe05980498091b"
};

const app = express()
const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)
const api = await makeApi(db)

app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use("/api", api)

app.listen(3000, () => console.log("Listening on 3000"))
