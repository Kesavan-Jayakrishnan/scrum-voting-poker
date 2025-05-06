'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateRoom() {
  const [playerName, setPlayerName] = useState('');
  const [roomName, setRoomName] = useState('');
  const router = useRouter();

  const handleCreateRoom = () => {
    if (!playerName || !roomName) {
      alert('Please enter your name and room name.');
      return;
    }
    const generatedRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    router.push(`/room/${generatedRoomId}?player=${playerName}&roomName=${roomName}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">Create Room</h1>

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
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="w-full p-3 rounded-lg bg-gray-700 placeholder-gray-400 text-white"
        />

        <button
          onClick={handleCreateRoom}
          className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded-lg font-semibold"
        >
          Create Room
        </button>
      </div>
    </div>
  );
}
