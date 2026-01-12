import { Schema, model } from "mongoose";

export type OrderStatus = "NEW" | "PAID" | "CANCELLED" | "SHIPPED";

export interface OrderStatusHistory {
    entity1Id: string;
    status: OrderStatus;
    time: Date;
    note?: string;
}

const schema = new Schema<OrderStatusHistory>(
    {
        entity1Id: { type: String, required: true, index: true },
        status: { type: String, required: true },
        time: { type: Date, required: true, default: () => new Date() },
        note: { type: String },
    },
    { versionKey: false, timestamps: false }
);

export const OrderStatusHistoryModel = model<OrderStatusHistory>(
    "OrderStatusHistory",
    schema
);
