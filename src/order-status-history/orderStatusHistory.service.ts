import { OrderStatusHistoryModel, type OrderStatus } from "./orderStatusHistory.model.js";

export interface CreateOrderStatusHistoryInput {
    entity1Id: string;
    status: OrderStatus;
    time?: string;
    note?: string;
}

export class OrderStatusHistoryService {
    async create(input: CreateOrderStatusHistoryInput) {
        const time = input.time ? new Date(input.time) : new Date();
        if (Number.isNaN(time.getTime())) {
            throw new Error("INVALID_TIME");
        }
        const doc: {
            entity1Id: string;
            status: OrderStatus;
            time: Date;
            note?: string;
        } = {
            entity1Id: input.entity1Id,
            status: input.status,
            time,
        };

        if (input.note !== undefined) {
            doc.note = input.note;
        }

        return OrderStatusHistoryModel.create(doc);
    }
    async findByEntity1(entity1Id: string, opts: { from: number; size: number }) {
        return OrderStatusHistoryModel.find({ entity1Id })
            .sort({ time: -1 })
            .skip(opts.from)
            .limit(opts.size)
            .lean();
    }
    async countByEntity1Ids(entity1Ids: string[]) {

        const uniqueIds = [...new Set(entity1Ids)];

        const rows = await OrderStatusHistoryModel.aggregate([
            { $match: { entity1Id: { $in: uniqueIds } } },
            { $group: { _id: "$entity1Id", count: { $sum: 1 } } },
        ]);

        const out: Record<string, number> = {};
        for (const id of uniqueIds) out[id] = 0;
        for (const r of rows) out[String(r._id)] = Number(r.count);

        return out;
    }
}

