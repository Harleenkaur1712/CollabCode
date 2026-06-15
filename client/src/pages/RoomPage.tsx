import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { socket } from "../socket/socket";
import { getRoomDetails, saveRoomCode } from "../api/roomApi";
import { useAuth } from "../context/AuthContext";
import CodeEditor from "../components/CodeEditor";
import { executeCode } from "../api/codeApi";
import { toast } from "react-hot-toast/headless";

interface Participant {
  _id: string;
  name: string;
  email: string;
}

interface Room {
  _id: string;
  name: string;
  roomCode: string;
  participants: Participant[];

  code: string;
  language: string;
}

const RoomPage = () => {
  const { roomCode } = useParams();

  const { user } = useAuth();

  const hasJoined = useRef(false);

  const [room, setRoom] = useState<Room | null>(null);

  const [output, setOutput] = useState("");
  const handleRunCode = async () => {
    try {
      const result = await executeCode(language, code);

      const finalOutput =
        result.stdout || result.stderr || result.compileOutput || "No Output";

      setOutput(finalOutput);
    } catch (error) {
      console.error(error);

      setOutput("Execution Failed");
    }
  };

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const [language, setLanguage] = useState("javascript");

  const [code, setCode] = useState(`// Welcome to CollabCode

function solve() {

}
`);

  // Connect Socket
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  // Join Room
  useEffect(() => {
    if (!roomCode || !user) return;

    if (hasJoined.current) return;

    hasJoined.current = true;

    socket.emit("join-room", {
      roomCode,
      userId: user.id,
      userName: user.name,
    });
  }, [roomCode, user]);

  // Online Users Listener
  useEffect(() => {
    socket.on("room-users", (users: string[]) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("room-users");
    };
  }, []);

  // Receive Code Updates
  useEffect(() => {
    socket.on("receive-code", (incomingCode: string) => {
      setCode(incomingCode);
    });

    return () => {
      socket.off("receive-code");
    };
  }, []);

  // Fetch Room Details
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        if (!roomCode) return;

        const data = await getRoomDetails(roomCode);

        setRoom(data);

        if (data.code) {
          setCode(data.code);
        }

        if (data.language) {
          setLanguage(data.language);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchRoom();
  }, [roomCode]);

  useEffect(() => {
    if (!roomCode) return;

    const timer = setTimeout(async () => {
      try {
        await saveRoomCode(roomCode, code, language);

        console.log("Auto Saved");
      } catch (error) {
        console.error("Auto Save Failed", error);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [code, language, roomCode]);

  useEffect(() => {
    socket.on("receive-language", (incomingLanguage: string) => {
      setLanguage(incomingLanguage);
    });

    return () => {
      socket.off("receive-language");
    };
  }, []);

  // Handle Code Changes
  const handleCodeChange = (value: string) => {
    setCode(value);

    socket.emit("code-change", {
      roomCode,
      code: value,
    });
  };

  if (!room) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold">{room.name}</h1>

            <p className="text-slate-400">Room Code: {room.roomCode}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);

                toast.success("Invite Link Copied!");
              }}
              className="rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
            >
              Copy Invite Link
            </button>

            <button
              onClick={handleRunCode}
              className="rounded-lg bg-green-600 px-4 py-2 font-semibold hover:bg-green-700"
            >
              Run Code
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-72 border-r border-slate-800 bg-slate-900 p-4 overflow-y-auto">
          <h2 className="mb-3 text-lg font-semibold">Participants</h2>

          <div className="space-y-2">
            {room.participants.map((participant) => (
              <div
                key={participant._id}
                className="rounded-lg bg-slate-800 p-2"
              >
                {participant.name}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">Online Users</h2>

            <div className="space-y-2">
              {onlineUsers.map((onlineUser, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-green-900/30 border border-green-700 p-2"
                >
                  🟢 {onlineUser}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="mb-3 text-lg font-semibold">Language</h2>

            <select
              value={language}
              onChange={(e) => {
                const newLanguage = e.target.value;

                setLanguage(newLanguage);

                socket.emit("language-change", {
                  roomCode,
                  language: newLanguage,
                });
              }}
              className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
            >
              <option value="javascript">JavaScript</option>

              <option value="typescript">TypeScript</option>

              <option value="cpp">C++</option>

              <option value="java">Java</option>

              <option value="python">Python</option>
            </select>
          </div>
        </div>

        {/* Editor + Output */}
        <div className="flex flex-1 flex-col">
          {/* Editor */}
          <div className="flex-1">
            <CodeEditor
              code={code}
              language={language}
              onChange={handleCodeChange}
            />
          </div>

          {/* Output Console */}
          <div className="h-56 border-t border-slate-800 bg-black p-4 overflow-auto">
            <h2 className="mb-2 text-lg font-semibold">Output</h2>

            <pre className="text-green-400 whitespace-pre-wrap">
              {output || "Run code to see output..."}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
