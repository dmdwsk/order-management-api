import express from "express";
import type { Request, Response } from "express";


const app = express();
app.use(express.json());

const existing = new Set(["1", "2", "test-order"]);

app.get("/api/orders/:id", (req: Request<{ id: string }>, res: Response) => {
    const { id } = req.params;

    if (existing.has(id)) return res.status(200).json({ id });
    return res.status(404).json({ message: "Order not found" });
});

app.listen(7777, () => console.log("✅ Entity1 stub on http://localhost:7777"));
