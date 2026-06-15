const roomCodeState = new Map<string, string>();

const roomUsers = new Map<string, { socketId: string; userName: string }[]>();

import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import { JoinRoomPayload } from "./src/types/socket";

import app from "./src/app";
import connectDB from "./src/config/db";

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join-room", (data: JoinRoomPayload) => {
    const { roomCode, userName } = data;

    socket.join(roomCode);

    const users = roomUsers.get(roomCode) || [];

    const exists = users.some((u) => u.socketId === socket.id);

    if (!exists) {
      users.push({
        socketId: socket.id,
        userName,
      });
    }

    roomUsers.set(roomCode, users);

    io.to(roomCode).emit(
      "room-users",
      users.map((u) => u.userName),
    );

    const existingCode = roomCodeState.get(roomCode);

    if (existingCode) {
      socket.emit("receive-code", existingCode);
    }
  });

  socket.on("code-change", ({ roomCode, code }) => {
    roomCodeState.set(roomCode, code);

    socket.to(roomCode).emit("receive-code", code);
  });

  socket.on(
    "language-change",
    (data: { roomCode: string; language: string }) => {
      socket.to(data.roomCode).emit("receive-language", data.language);
    },
  );

  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);

    roomUsers.forEach((users, roomCode) => {
      const updatedUsers = users.filter((u) => u.socketId !== socket.id);

      roomUsers.set(roomCode, updatedUsers);

      io.to(roomCode).emit(
        "room-users",
        updatedUsers.map((u) => u.userName),
      );
    });
  });
});

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
