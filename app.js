import express from "express";
import { config } from "dotenv";
import cors from "cors";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRoute.js";
config();
const app=express();

app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

app.use("/api/v1/users", userRouter);

app.use(notFound);

app.use(errorHandler);

export default app;
