export class ApiError extends Error {
    public readonly status: number;
    public readonly code?: string;
    public readonly details?: unknown;

    constructor(status: number, message: string, code?: string, details?: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;


        if (code !== undefined) this.code = code;
        if (details !== undefined) this.details = details;

        Error.captureStackTrace?.(this, ApiError);
    }

    static badRequest(message: string, code?: string, details?: unknown) {
        return new ApiError(400, message, code, details);
    }

    static serviceUnavailable(message: string, code?: string, details?: unknown) {
        return new ApiError(503, message, code, details);
    }

    static internal(message = "Internal error", code?: string, details?: unknown) {
        return new ApiError(500, message, code, details);
    }
}
