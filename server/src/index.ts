import dotenv from "dotenv";
dotenv.config();

import express, { Express } from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-records";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

// ✅ Use environment variable instead of hardcoded URI
const mongoURI: string = process.env.MONGO_URI!;

mongoose
  .connect(mongoURI)
  .then(() => console.log("CONNECTED TO MONGODB!"))
  .catch((err) => console.error("Failed to Connect to MongoDB:", err));

app.use("/financial-records", financialRecordRouter);

app.get("/", (req, res) => {
  res.send("ExpenseEase backend is running.");
});

app.listen(port, () => {
  console.log(`Server Running on Port ${port}`);
});
