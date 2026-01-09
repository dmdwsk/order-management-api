import express from "express";
import { connectDb } from "./db";

const app = express();
app.use(express.json());

await connectDb();

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(3000, () => console.log("API on http://localhost:3000"));
