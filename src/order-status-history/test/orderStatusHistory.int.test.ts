import request from "supertest";
import { app } from "../../app.js";

import {
    connectMemoryMongo,
    clearMemoryMongo,
    closeMemoryMongo,
} from "../../test/mongoMemory.js";

import { startEntity1Stub } from "../../test/fakeEntity1Server.js";
import { OrderStatusHistoryModel } from "../orderStatusHistory.model.js";

describe("OrderStatusHistory API (integration)", () => {
    beforeAll(async () => {
        await connectMemoryMongo();
    });

    afterEach(async () => {
        await clearMemoryMongo();
        delete process.env.ENTITY1_BASE_URL;
    });

    afterAll(async () => {
        await closeMemoryMongo();
    });

    describe("POST /api/entity3", () => {
        it("201 – creates history record when Entity1 exists", async () => {
            const stub = await startEntity1Stub({ existingIds: ["test-order"] });
            process.env.ENTITY1_BASE_URL = stub.baseUrl;

            const res = await request(app)
                .post("/api/entity3")
                .send({
                    entity1Id: "test-order",
                    status: "NEW",
                    note: "created",
                });

            expect(res.status).toBe(201);
            expect(res.body).toMatchObject({
                entity1Id: "test-order",
                status: "NEW",
                note: "created",
            });
            expect(res.body._id).toBeDefined();
            expect(res.body.time).toBeDefined();

            const saved = await OrderStatusHistoryModel.findById(res.body._id);
            expect(saved).not.toBeNull();

            await stub.close();
        });

        it("400 INVALID_TIME when time is invalid", async () => {
            const stub = await startEntity1Stub({ existingIds: ["1"] });
            process.env.ENTITY1_BASE_URL = stub.baseUrl;

            const res = await request(app)
                .post("/api/entity3")
                .send({
                    entity1Id: "1",
                    status: "NEW",
                    time: "invalid-date",
                });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                message: "time must be a valid ISO date",
                code: "INVALID_TIME",
                details: undefined,
            });

            await stub.close();
        });

        it("400 ENTITY1_NOT_FOUND when Entity1 does not exist", async () => {
            const stub = await startEntity1Stub({ existingIds: [] });
            process.env.ENTITY1_BASE_URL = stub.baseUrl;

            const res = await request(app)
                .post("/api/entity3")
                .send({
                    entity1Id: "missing",
                    status: "NEW",
                });

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                message: "Entity1 does not exist",
                code: "ENTITY1_NOT_FOUND",
                details: undefined,
            });

            await stub.close();
        });

        it("503 ENTITY1_SERVICE_UNAVAILABLE when Entity1 service is down", async () => {
            process.env.ENTITY1_BASE_URL = "http://127.0.0.1:1";

            const res = await request(app)
                .post("/api/entity3")
                .send({
                    entity1Id: "any",
                    status: "NEW",
                });

            expect(res.status).toBe(503);
            expect(res.body).toEqual({
                message: "Entity1 service unavailable",
                code: "ENTITY1_SERVICE_UNAVAILABLE",
                details: undefined,
            });
        });
    });

    describe("GET /api/entity3", () => {
        it("400 MISSING_ENTITY1ID when entity1Id is missing", async () => {
            const res = await request(app).get("/api/entity3");

            expect(res.status).toBe(400);
            expect(res.body).toEqual({
                message: "entity1Id is required (query param)",
                code: "MISSING_ENTITY1ID",
                details: undefined,
            });
        });

        it("200 returns sorted history with pagination", async () => {
            await OrderStatusHistoryModel.create([
                { entity1Id: "A", status: "NEW", time: new Date("2025-01-01") },
                { entity1Id: "A", status: "PAID", time: new Date("2025-01-03") },
                { entity1Id: "A", status: "SHIPPED", time: new Date("2025-01-02") },
            ]);

            const res = await request(app)
                .get("/api/entity3?entity1Id=A&size=2&from=0");

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0].status).toBe("PAID");
            expect(res.body[1].status).toBe("SHIPPED");
        });
    });

    describe("POST /api/entity3/_counts", () => {
        it("200 returns counts per entity1Id (with deduplication)", async () => {
            await OrderStatusHistoryModel.create([
                { entity1Id: "a", status: "NEW", time: new Date() },
                { entity1Id: "a", status: "PAID", time: new Date() },
                { entity1Id: "b", status: "NEW", time: new Date() },
            ]);

            const res = await request(app)
                .post("/api/entity3/_counts")
                .send({ entity1Ids: ["a", "a", "b", "c"] });

            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                a: 2,
                b: 1,
                c: 0,
            });
        });
    });
});
