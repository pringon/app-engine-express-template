import { Router } from "express";
import vision from "@google-cloud/vision";

import * as suggestionF from "./models/suggestion.js"


export default async function makeApi(db, upload) {
    const suggestionModel = suggestionF.getModel(db)
    const visionClient = new vision.ImageAnnotatorClient();

    const api = Router();

    api.get("/hello", async (req, res) => {
        res.json({ code: 200, message: "Hello World" })
    })

    api.post("/suggestions", async (req, res) => {
        if (!req.body.name || !req.body.suggestion) {
            return res.status(400).json({ code: 400, message: "Missing name or suggestion"})
        }
        const { name, suggestion } = req.body
        
        const entity = await suggestionF.addSuggestion(suggestionModel, { name, suggestion })
        res.status(201).json({ code: 201, suggestionId: entity.id })
    })
    
    api.get("/suggestions", async (req, res) => {
        const suggestions = await suggestionF.getSuggestions(suggestionModel)
        res.status(200).json({ code: 200, suggestions })
    })

    api.post("/labels/upload", upload.single("image"), async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ code: 400, message: "Missing image" })
        }
        if (!req.body.labels) {
            return res.status(400).json({ code: 400, message: "Please specify labels to match on" })
        }

        const wantedLabels = req.body.labels.split(",").map(label => label.trim().toLowerCase())

        const [result] = await visionClient.labelDetection(req.file.path)
        const detectedLabels = result.labelAnnotations.map(label => ({
            ...label,
            description: label.description.trim().toLowerCase()
        }))
        if (!detectedLabels) {
            return res.status(500).json({ code: 500, message: "Could not process the image "})
        }

        const matchedLabels = wantedLabels
            .map(wantedLabel => {
                let maxScore = 0
                for (const label of detectedLabels) {
                    if (label.description.includes(wantedLabel)) {
                        maxScore = Math.max(maxScore, label.score)
                    }
                }
                return { label: wantedLabel, score: maxScore }
            })
            .filter(({ score }) => score > 0)
        res.status(200).json({ code: 200, matchedLabels })
    })

    return api
}
