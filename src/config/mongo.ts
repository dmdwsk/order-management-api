import {useEnv} from "../useEnv.js";


export function getMongoUri(): string {
    return useEnv("MONGO_URI", "mongodb://localhost:27017/entity3_db");
}
