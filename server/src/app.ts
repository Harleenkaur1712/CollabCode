import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import roomRoutes from "./routes/roomRoutes";
import codeRoutes from "./routes/codeRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("CollabCode API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/code", codeRoutes);
export default app;
