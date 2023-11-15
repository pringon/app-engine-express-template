import "dotenv/config";
import express from "express"
import { initializeApp } from "firebase/app"
import { getFirestore } from 'firebase/firestore/lite'
import multer from "multer"

import makeApi from "./api.js"

import path from "node:path"
import os from "node:os"

/**
 * FIREBASE PERSISTENCE SETUP
 */
const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: "urbanlab-4afdd.firebaseapp.com",
  projectId: "urbanlab-4afdd",
  storageBucket: "urbanlab-4afdd.appspot.com",
  messagingSenderId: "278086436354",
  appId: "1:278086436354:web:a760b19abe05980498091b"
};
const firebase = initializeApp(firebaseConfig)
const db = getFirestore(firebase)

/**
 * FILE UPLOAD MIDDLEWARE SETUP
 */
const FILES_TEMP_FOLDER = path.join(os.tmpdir(), "/app-engine-express-temple-files")
const upload = multer({ dest: FILES_TEMP_FOLDER });

const app = express()
const api = await makeApi(db, upload)

app.use(express.static('public'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/api", api)

app.listen(8080, () => console.log("Listening on 8080"))
