import express from "express";
import http from "http";
import type { Request, Response } from "express";

export async function startEntity1Stub(opts?: {
    existingIds?: string[];
    forceStatus?: number;
}) {
    const app = express();
    app.use(express.json());

    const existing = new Set(opts?.existingIds ?? ["1", "2", "test-order"]);

    app.get("/api/orders/:id", (req: Request<{ id: string }>, res: Response) => {
        if (opts?.forceStatus) return res.sendStatus(opts.forceStatus);

        const { id } = req.params;
        if (existing.has(id)) return res.status(200).json({ id });
        return res.status(404).json({ message: "Order not found" });
    });

    const server = http.createServer(app);


    await new Promise<void>((resolve) => server.listen(0, resolve));

    const addr = server.address();
    if (!addr || typeof addr === "string") throw new Error("Cannot bind stub server");
    const baseUrl = `http://127.0.0.1:${addr.port}`;

    return {
        baseUrl,
        close: () => new Promise<void>((resolve) => server.close(() => resolve())),
    };
}
