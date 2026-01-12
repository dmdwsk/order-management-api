import type { OrderStatus } from "../../order-status-history/orderStatusHistory.model.js";
import type { CreateEntity3Dto } from "../dto/orderStatusHistory/createEntity3.dto.js";

const ALLOWED: OrderStatus[] = ["NEW", "PAID", "CANCELLED", "SHIPPED"];

export function validateCreateEntity3(
    body: any
):
    | { ok: true; value: CreateEntity3Dto }
    | { ok: false; message: string } {
    const entity1Id = body?.entity1Id;
    const statusRaw = body?.status;
    const time = body?.time;
    const note = body?.note;

    if (typeof entity1Id !== "string" || !entity1Id.trim()) {
        return { ok: false, message: "entity1Id is required (string)" };
    }
    if (typeof statusRaw !== "string" || !ALLOWED.includes(statusRaw as OrderStatus)) {
        return { ok: false, message: `status must be one of: ${ALLOWED.join(", ")}` };
    }
    if (time !== undefined && typeof time !== "string") {
        return { ok: false, message: "time must be ISO string (optional)" };
    }
    if (note !== undefined && typeof note !== "string") {
        return { ok: false, message: "note must be string (optional)" };
    }

    const value: CreateEntity3Dto = {
        entity1Id,
        status: statusRaw as OrderStatus,
        ...(time !== undefined ? { time } : {}),
        ...(note !== undefined ? { note } : {}),
    };

    return { ok: true, value };
}
