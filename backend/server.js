import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectMongoDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = 8005 || process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
  connectMongoDB();
});
