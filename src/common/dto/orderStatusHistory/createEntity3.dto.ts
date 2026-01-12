import type { OrderStatus } from "../../../order-status-history/orderStatusHistory.model.js";

export interface CreateEntity3Dto {
    entity1Id: string;
    status: OrderStatus;
    time?: string;
    note?: string;
}
