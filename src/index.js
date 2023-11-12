import express from "express"
import makeApi from "./api.js"

const app = express()
const api = await makeApi()

app.use(express.static('public'))
app.use("/api", api)

app.listen(3000, () => console.log("Listening on 3000"))
