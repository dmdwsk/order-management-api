import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongo: MongoMemoryServer;

export async function connectMemoryMongo() {
    mongo = await MongoMemoryServer.create();
    await mongoose.connect(mongo.getUri());
}

export async function clearMemoryMongo() {
    const cols = mongoose.connection.collections;
    for (const k of Object.keys(cols)) {
        await cols[k].deleteMany({});
    }
}

export async function closeMemoryMongo() {
    await mongoose.disconnect();
    if (mongo) await mongo.stop();
}
