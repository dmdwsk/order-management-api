export function useEnv(key: string, fallback?: string): string {
    const value = process.env[key];
    if (value !== undefined && value !== "") return value;
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env var: ${key}`);
}

export function useEnvInt(key: string, fallback?: number): number {
    const raw = process.env[key];
    if (raw === undefined || raw === "") {
        if (fallback !== undefined) return fallback;
        throw new Error(`Missing required env var: ${key}`);
    }
    const n = Number(raw);
    if (!Number.isInteger(n)) throw new Error(`Env var ${key} must be an integer`);
    return n;
}
