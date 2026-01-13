import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

export async function connectMemoryMongo() {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
}

export async function clearMemoryMongo(): Promise<void> {
    const cols = mongoose.connection.collections;

    for (const col of Object.values(cols)) {
        await col.deleteMany({});
    }
}


export async function closeMemoryMongo() {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
}
