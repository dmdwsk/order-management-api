import type { ErrorRequestHandler } from "express";
import {ApiError} from "./ApiError.js";


export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({
            message: err.message,
            code: err.code,
            details: err.details,
        });
    }

    console.error("Unhandled error:", err);
    return res.status(500).json({ message: "Internal error" });
};
