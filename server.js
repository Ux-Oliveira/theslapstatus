import express from "express"
import cors from "cors"

import handler from "./api/generate-video.js"
import pearHandler from "./api/pear-video.js"

const app = express()

app.use(cors())
app.use(express.json({ limit: "50mb" }))

app.post("/api/generate-video", handler)

app.post("/api/pear-video", pearHandler)

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001")
})