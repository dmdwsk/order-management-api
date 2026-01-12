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
}
