import { Router } from "express";
import { OrderStatusHistoryService } from "./orderStatusHistory.service.js";
import type { OrderStatus } from "./orderStatusHistory.model.js";
import { validateCreateEntity3 } from "../common/validators/entity3.validator.js";

export const orderStatusHistoryRouter = Router();
const service = new OrderStatusHistoryService();

async function assertEntity1Exists(entity1Id: string) {
    const base = process.env.ENTITY1_BASE_URL ?? "http://localhost:7777";
    const url = `${base}/api/orders/${encodeURIComponent(entity1Id)}`;


    let resp: Response;
    try {
        resp = await fetch(url);
    } catch {
        throw new Error("ENTITY1_SERVICE_UNAVAILABLE");
    }

    if (resp.status === 404) throw new Error("ENTITY1_NOT_FOUND");
    if (!resp.ok) throw new Error("ENTITY1_SERVICE_ERROR");
}

orderStatusHistoryRouter.post("/api/entity3", async (req, res) => {
    const validation = validateCreateEntity3(req.body);
    if (!validation.ok) return res.status(400).json({ message: validation.message });

    const { entity1Id, status, time, note } = validation.value;

    try {
        await assertEntity1Exists(entity1Id);
    } catch (e: any) {
        if (e.message === "ENTITY1_NOT_FOUND") {
            return res.status(400).json({ message: "Entity1 does not exist" });
        }
        if (e.message === "ENTITY1_SERVICE_UNAVAILABLE") {
            return res.status(503).json({ message: "Entity1 service unavailable" });
        }
        return res.status(503).json({ message: "Entity1 service error" });
    }

    try {
        const created = await service.create(validation.value);
        return res.status(201).json(created);
    } catch (e: any) {
        if (e.message === "INVALID_TIME") {
            return res.status(400).json({ message: "time must be a valid ISO date" });
        }
        return res.status(500).json({ message: "Internal error" });
    }

});
orderStatusHistoryRouter.get("/api/entity3", async (req, res) => {
    const entity1Id = req.query.entity1Id;
    const sizeRaw = req.query.size;
    const fromRaw = req.query.from;

    if (typeof entity1Id !== "string" || !entity1Id.trim()) {
        return res.status(400).json({message: "entity1Id is required (query param)"});
    }

    let size = 20;
    if (sizeRaw !== undefined) {
        const parsed = Number(sizeRaw);
        if (!Number.isInteger(parsed) || parsed <= 0) {
            return res.status(400).json({ message: "size must be a positive integer" });
        }
        size = parsed;
    }
    let from = 0;
    if (fromRaw !== undefined) {
        const parsed = Number(fromRaw);
        if (!Number.isInteger(parsed) || parsed < 0) {
            return res.status(400).json({ message: "from must be a non-negative integer" });
        }
        from = parsed;
    }
    try {
        const items = await service.findByEntity1(entity1Id, { from, size });
        return res.json(items);
    } catch {
        return res.status(500).json({ message: "Internal error" });
    }
});
