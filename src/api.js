import { Router } from "express";
import { collection, addDoc, query, getDocs, orderBy } from 'firebase/firestore/lite';

export default async function makeApi(db) {
    const suggestionModel = collection(db, 'suggestions');

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

    return api;
}
