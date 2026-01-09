import mongoose from "mongoose";

export async function connectDb(): Promise<void> {
    const uri = process.env.MONGO_URI ?? "mongodb://localhost:27017/entity3_db";
    await mongoose.connect(uri);
    console.log("✅ Mongo connected");
}
