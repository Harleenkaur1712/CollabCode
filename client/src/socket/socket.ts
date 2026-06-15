import { io } from "socket.io-client";

const SOCKET_URL =
  "https://collabcode-0n39.onrender.com";

export const socket = io(
  SOCKET_URL,
  {
    autoConnect: false,
  }
);