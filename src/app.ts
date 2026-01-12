import express from "express";
import {orderStatusHistoryRouter} from "./order-status-history/orderStatusHistory.router.js";


export const app = express();
app.use(express.json());
app.use(orderStatusHistoryRouter);
app.get("/health", (_req, res) => res.json({ ok: true }));
