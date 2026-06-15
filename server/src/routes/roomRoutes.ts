import { Router } from "express";

import { createRoom, joinRoom, getRoomDetails, saveRoomCode, getMyRooms } from "../controllers/roomController";
import { authenticateUser } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/create",
  authenticateUser,
  createRoom
);

router.post(
  "/join",
  authenticateUser,
  joinRoom
);

router.get(
  "/my-rooms",
  authenticateUser,
  getMyRooms
);

router.get(
  "/:roomCode",
  authenticateUser,
  getRoomDetails
);

router.put(
  "/:roomCode/save",
  authenticateUser,
  saveRoomCode
);

export default router;