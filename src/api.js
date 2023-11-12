import { Router } from "express";

export default async function makeApi() {
    const api = Router();

    api.get("/hello", async (req, res) => {
        res.json({ code: 200, message: "Hello World" })
    })

    return api;
}
