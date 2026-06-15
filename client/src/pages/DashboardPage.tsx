import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { createRoom, joinRoom, getMyRooms } from "../api/roomApi";
import { toast } from "react-hot-toast/headless";

interface Room {
  _id: string;
  name: string;
  roomCode: string;
  updatedAt: string;
}

const DashboardPage = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getMyRooms();

        setRooms(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRooms();
  }, []);

  const handleCreateRoom = async () => {
    try {
      const room = await createRoom(roomName);
      toast.success("Room Created");
      navigate(`/room/${room.roomCode}`);
    } catch (error) {
      console.error(error);
    }
  };

  const handleJoinRoom = async () => {
    try {
      await joinRoom(roomCode);
      toast.success("Joined Room");
      navigate(`/room/${roomCode}`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <div className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">CollabCode 🚀</h1>

          <button
            onClick={logout}
            className="rounded-lg bg-red-500 px-4 py-2 font-medium transition hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="text-4xl font-bold">Welcome, {user?.name} 👋</h2>

        <p className="mt-3 text-slate-400">
          Create collaborative coding rooms, code together in real-time, and run
          code instantly.
        </p>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {/* Create Room */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <h3 className="mb-4 text-2xl font-semibold">Create Room</h3>

            <input
              type="text"
              placeholder="Enter Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <button
              onClick={handleCreateRoom}
              className="mt-4 w-full rounded-lg bg-blue-600 py-3 font-semibold transition hover:bg-blue-700"
            >
              Create Room
            </button>
          </div>

          {/* Join Room */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
            <h3 className="mb-4 text-2xl font-semibold">Join Room</h3>

            <input
              type="text"
              placeholder="Enter Room Code"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-green-500"
            />

            <button
              onClick={handleJoinRoom}
              className="mt-4 w-full rounded-lg bg-green-600 py-3 font-semibold transition hover:bg-green-700"
            >
              Join Room
            </button>
          </div>
        </div>

        <hr className="my-8" />

        <h2 className="mb-4 text-xl font-bold text-white">Recent Rooms</h2>

        <div className="space-y-3">
          {rooms.length === 0 ? (
            <p className="text-slate-400">No rooms yet</p>
          ) : (
            rooms.map((room) => (
              <div
                key={room._id}
                className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-4"
              >
                <div>
                  <h3 className="font-semibold text-white">{room.name}</h3>

                  <p className="text-sm text-slate-400">{room.roomCode}</p>
                </div>

                <button
                  onClick={() => navigate(`/room/${room.roomCode}`)}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                  Open
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
