import { Router } from "express";
import { collection, addDoc, query, getDocs, orderBy } from 'firebase/firestore/lite';
import vision from "@google-cloud/vision";


export default async function makeApi(db, upload) {
    const suggestionModel = collection(db, 'suggestions');
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
        
        const entity = await addDoc(suggestionModel, { name, suggestion })
        res.status(201).json({ code: 201, suggestionId: entity.id })
    })
    
    api.get("/suggestions", async (req, res) => {
        const q = query(suggestionModel, orderBy('name', 'asc'))
        const entities = await getDocs(q)
        const suggestions = entities.docs.map(doc => doc.data())
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
