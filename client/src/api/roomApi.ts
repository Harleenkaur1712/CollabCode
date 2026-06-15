import api from "./axios";

export const createRoom = async (
  name: string
) => {
  const response = await api.post(
    "/rooms/create",
    { name }
  );

  return response.data;
};

export const joinRoom = async (
  roomCode: string
) => {
  const response = await api.post(
    "/rooms/join",
    { roomCode }
  );

  return response.data;
};

export const getMyRooms = async () => {
  const response = await api.get(
    "/rooms/my-rooms"
  );

  return response.data;
};

export const getRoomDetails = async (
  roomCode: string
) => {
  const response = await api.get(
    `/rooms/${roomCode}`
  );

  return response.data;
};

export const saveRoomCode = async (
  roomCode: string,
  code: string,
  language: string
) => {
  const response = await api.put(
    `/rooms/${roomCode}/save`,
    {
      code,
      language,
    }
  );

  return response.data;
};