import mongoose from "mongoose";
import { getMongoUri } from "./config/mongo.js";

export async function connectDb(): Promise<void> {
    const uri = getMongoUri();
    await mongoose.connect(uri);
    console.log("✅ Mongo connected");
}
