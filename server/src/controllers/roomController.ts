import { Response } from "express";
import mongoose from "mongoose";

import Room from "../models/Room";
import { AuthRequest } from "../middleware/authMiddleware";

export const createRoom = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({
        message: "Room name is required",
      });
      return;
    }

    if (!req.userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const userObjectId = new mongoose.Types.ObjectId(req.userId);

    const room = await Room.create({
      name,
      roomCode,
      owner: req.userId,
      participants: [req.userId],

      code: `// Welcome to CollabCode

function solve() {

}
`,

      language: "javascript",
    });

    res.status(201).json(room);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const joinRoom = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { roomCode } = req.body;
    const roomCodeValue = Array.isArray(roomCode) ? roomCode[0] : roomCode;

    if (!roomCodeValue) {
      res.status(400).json({
        message: "Room code is required",
      });
      return;
    }

    if (!req.userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const room = await Room.findOne({
      roomCode: roomCodeValue.toUpperCase(),
    });

    if (!room) {
      res.status(404).json({
        message: "Room not found",
      });
      return;
    }

    const alreadyJoined = room.participants.some(
      (participant) => participant.toString() === req.userId,
    );

    if (alreadyJoined) {
      res.status(200).json({
        message: "Already joined room",
        room,
      });
      return;
    }

    room.participants.push(new mongoose.Types.ObjectId(req.userId));

    await room.save();

    res.status(200).json({
      message: "Joined room successfully",
      room,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const getRoomDetails = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const roomCode = req.params.roomCode;

    if (!roomCode || Array.isArray(roomCode)) {
      res.status(400).json({
        message: "Invalid room code",
      });
      return;
    }

    const room = await Room.findOne({
      roomCode: roomCode.toUpperCase(),
    })
      .populate("owner", "name email")
      .populate("participants", "name email");

    if (!room) {
      res.status(404).json({
        message: "Room not found",
      });
      return;
    }

    // ADD THIS BLOCK
    if (!req.userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const isParticipant = room.participants.some(
      (participant: any) => participant._id.toString() === req.userId,
    );

    if (!isParticipant) {
      res.status(403).json({
        message: "Access denied",
      });
      return;
    }

    // THEN RETURN ROOM
    res.status(200).json(room);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
  
};

// saving code in mongoose database
export const saveRoomCode = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { roomCode } = req.params;

    const {
      code,
      language,
    } = req.body;

    const room =
      await Room.findOneAndUpdate(
        {
          roomCode,
        },
        {
          code,
          language,
        },
        {
          new: true,
        }
      );

    if (!room) {
      res.status(404).json({
        message:
          "Room not found",
      });

      return;
    }

    res.status(200).json({
      message:
        "Room saved successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Server Error",
    });
  }
};

// for getting all the rooms of a user
export const getMyRooms = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.userId) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const rooms = await Room.find({
      participants: req.userId,
    })
      .select(
        "name roomCode updatedAt"
      )
      .sort({
        updatedAt: -1,
      });

    res.status(200).json(rooms);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};