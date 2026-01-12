import { Router } from "express";
import type { RequestHandler } from "express";
import { OrderStatusHistoryService } from "./orderStatusHistory.service.js";
import { validateCreateEntity3 } from "../common/validators/entity3.validator.js";
import {ApiError} from "../exceptions/ApiError.js";



export const orderStatusHistoryRouter = Router();
const service = new OrderStatusHistoryService();


const asyncHandler =
    (fn: RequestHandler): RequestHandler =>
        (req, res, next) =>
            Promise.resolve(fn(req, res, next)).catch(next);

async function assertEntity1Exists(entity1Id: string) {
    const base = process.env.ENTITY1_BASE_URL ?? "http://localhost:7777";
    const url = `${base}/api/orders/${encodeURIComponent(entity1Id)}`;

    let resp: Response;
    try {
        resp = await fetch(url);
    } catch {
        throw ApiError.serviceUnavailable("Entity1 service unavailable", "ENTITY1_SERVICE_UNAVAILABLE");
    }

    if (resp.status === 404) {
        throw ApiError.badRequest("Entity1 does not exist", "ENTITY1_NOT_FOUND");
    }

    if (!resp.ok) {
        throw ApiError.serviceUnavailable("Entity1 service error", "ENTITY1_SERVICE_ERROR", {
            status: resp.status,
        });
    }
}


orderStatusHistoryRouter.post(
    "/api/entity3",
    asyncHandler(async (req, res) => {
        const validation = validateCreateEntity3(req.body);
        if (!validation.ok) throw ApiError.badRequest(validation.message, "VALIDATION_ERROR");

        const { entity1Id } = validation.value;

        await assertEntity1Exists(entity1Id);

        try {
            const created = await service.create(validation.value);
            return res.status(201).json(created);
        } catch (e: any) {
            if (e?.message === "INVALID_TIME") {
                throw ApiError.badRequest("time must be a valid ISO date", "INVALID_TIME");
            }
            throw ApiError.internal("Internal error");
        }
    })
);


orderStatusHistoryRouter.get(
    "/api/entity3",
    asyncHandler(async (req, res) => {
        const entity1Id = req.query.entity1Id;
        const sizeRaw = req.query.size;
        const fromRaw = req.query.from;

        if (typeof entity1Id !== "string" || !entity1Id.trim()) {
            throw ApiError.badRequest("entity1Id is required (query param)", "MISSING_ENTITY1ID");
        }

        // optional: якщо прилетить масив (size=1&size=2)
        if (Array.isArray(sizeRaw)) throw ApiError.badRequest("size must be a single value", "INVALID_SIZE");
        if (Array.isArray(fromRaw)) throw ApiError.badRequest("from must be a single value", "INVALID_FROM");

        let size = 20;
        if (sizeRaw !== undefined) {
            const parsed = Number(sizeRaw);
            if (!Number.isInteger(parsed) || parsed <= 0) {
                throw ApiError.badRequest("size must be a positive integer", "INVALID_SIZE");
            }
            size = parsed;
        }

        let from = 0;
        if (fromRaw !== undefined) {
            const parsed = Number(fromRaw);
            if (!Number.isInteger(parsed) || parsed < 0) {
                throw ApiError.badRequest("from must be a non-negative integer", "INVALID_FROM");
            }
            from = parsed;
        }

        const items = await service.findByEntity1(entity1Id, { from, size });
        return res.json(items);
    })
);


orderStatusHistoryRouter.post(
    "/api/entity3/_counts",
    asyncHandler(async (req, res) => {
        const ids = req.body?.entity1Ids;

        if (!Array.isArray(ids)) {
            throw ApiError.badRequest("entity1Ids must be an array", "INVALID_ENTITY1IDS");
        }

        if (ids.length === 0) {
            return res.json({});
        }

        for (const id of ids) {
            if (typeof id !== "string" || !id.trim()) {
                throw ApiError.badRequest("entity1Ids must contain non-empty strings", "INVALID_ENTITY1IDS");
            }
        }

        const result = await service.countByEntity1Ids(ids);
        return res.json(result);
    })
);
