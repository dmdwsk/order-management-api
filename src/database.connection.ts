import mongoose from "mongoose";

export async function connectDb(): Promise<void> {
    const uri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/entity3_db";

    console.log("🔌 Connecting to Mongo:", uri);

    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
    });

    console.log("✅ Mongo connected");
}
