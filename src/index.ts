import { app } from "./app.js";
import { connectDb } from "./database.connection.js";

const PORT = Number(process.env.PORT ?? 3000);

async function bootstrap() {
    console.log("🚀 Starting bootstrap...");

    console.log("🔌 About to connect DB...");
    await connectDb();
    console.log("✅ DB connected, starting server...");

    app.listen(PORT, () => {
        console.log(`✅ API running on http://localhost:${PORT}`);
    });
}


bootstrap().catch((err) => {
    console.error("❌ Failed to start application", err);
    process.exit(1);
});
