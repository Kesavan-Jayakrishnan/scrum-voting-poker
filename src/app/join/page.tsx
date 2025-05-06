'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function JoinRoom() {
  const [playerName, setPlayerName] = useState('');
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleJoinRoom = () => {
    if (!playerName || !roomId) {
      alert('Please enter your name and room ID.');
      return;
    }
    router.push(`/room/${roomId}?player=${playerName}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">Join Room</h1>

      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md flex flex-col gap-6">
        <input
          type="text"
          placeholder="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white"
        />

        <input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white"
        />

        <button
          onClick={handleJoinRoom}
          className="w-full bg-green-600 hover:bg-green-700 p-3 rounded-lg font-semibold"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
