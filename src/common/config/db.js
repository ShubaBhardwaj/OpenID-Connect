import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBConnect = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MOGO_URI;

    if (!mongoUri) {
        throw new Error("MongoDB URI is missing. Set MONGO_URI in your .env file.");
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
}

export default DBConnect