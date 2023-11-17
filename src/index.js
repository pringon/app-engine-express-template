import "dotenv/config";
import express from "express"
import multer from "multer"

import makeApi from "./api.js"
import { getDatabase } from "./data.js"

import path from "node:path"
import os from "node:os"

/**
 * PERSISTENCE SETUP
 */
const db = getDatabase(process.env.FIREBASE_KEY)

/**
 * FILE UPLOAD MIDDLEWARE SETUP
 * XXX: Does not currently delete files from disk, if this becomes a bottleneck consider adding a middleware
 */
const FILES_TEMP_FOLDER = path.join(os.tmpdir(), "/app-engine-express-temple-files")
const upload = multer({ dest: FILES_TEMP_FOLDER });

const app = express()
const api = await makeApi(db, upload)

app.use(express.static('public'))

app.use("/api", express.json())
app.use("/api", express.urlencoded({ extended: true }))
app.use("/api", api)

app.listen(8080, () => console.log("Listening on 8080"))
