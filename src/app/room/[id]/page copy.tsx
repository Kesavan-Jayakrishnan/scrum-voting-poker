'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  startConnection,
  sendVote,
  revealVotes,
  resetVotes,
  getConnection,
} from '@/lib/signalr';

type Player = {
  name: string;
  vote: string | null;
};

const votingOptions = ['1', '2', '3', '5', '8', '13', '?'];

export default function RoomPageCopy() {
  const { id: roomId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const playerName = searchParams.get('player') || 'Anonymous';

  const [players, setPlayers] = useState<Player[]>([]);
  const [showVotes, setShowVotes] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  // -- HANDLERS --
  const onPlayerJoined = (name: string) => {
    setPlayers((prev) =>
      prev.some((p) => p.name === name) ? prev : [...prev, { name, vote: null }]
    );
  };

  const onReceiveVote = (name: string, vote: string) => {
    setPlayers((prev) =>
      prev.map((p) => (p.name === name ? { ...p, vote } : p))
    );
  };

  const onRevealVotes = () => {
    setShowVotes(true);
  };

  const onResetVotes = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, vote: null })));
    setShowVotes(false);
    setHasVoted(false);
  };
  

  // -- EFFECT --
  useEffect(() => {
    const connect = async () => {
      try {
        // ✅ 1. Fetch room data from backend API
        const res = await fetch(`https://localhost:7293/api/rooms/${roomId}`);
        if (res.ok) {
          const data = await res.json();
          setPlayers(data.players);
        }
  
        // ✅ 2. Then connect to SignalR
        await startConnection(roomId, playerName);
        const connection = getConnection();
  
        connection.off('PlayerJoined');
        connection.off('ReceiveVote');
        connection.off('RevealVotes');
        connection.off('ResetVotes');
        connection.off('PlayerList');
  
        connection.on('PlayerJoined', onPlayerJoined);
        connection.on('ReceiveVote', onReceiveVote);
        connection.on('RevealVotes', onRevealVotes);
        connection.on('ResetVotes', onResetVotes);
        connection.on('PlayerList', (playersFromServer: Player[]) => {
          setPlayers(playersFromServer);
        });
  
      } catch (error) {
        console.error('Failed to connect:', error);
      }
    };
  
    connect();
  }, [roomId, playerName]);
  

  // -- VOTE ACTIONS --
  const handleVote = async (vote: string) => {
    await sendVote(roomId, playerName, vote);
    setHasVoted(true);
  };

  const handleReveal = async () => {
    await revealVotes(roomId);
  };

  const handleReset = async () => {
    await resetVotes(roomId);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Room: {roomId}</h1>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4 mb-10">
        {votingOptions.map((vote) => (
          <button
            key={vote}
            onClick={() => handleVote(vote)}
            disabled={hasVoted}
            className={`rounded-xl px-6 py-4 text-xl font-semibold shadow transition duration-300 ${
              hasVoted
                ? 'bg-gray-700 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {vote}
          </button>
        ))}
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Players</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {players.map((player) => (
            <div
              key={player.name}
              className="bg-gray-800 p-4 rounded-xl text-center shadow"
            >
              <div className="text-lg font-bold">{player.name}</div>
              <div className="mt-2 text-3xl">
                {showVotes
                  ? player.vote || '-'
                  : player.vote
                  ? '✅'
                  : '❔'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleReveal}
          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl text-white font-semibold"
        >
          Reveal Votes
        </button>
        <button
          onClick={handleReset}
          className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl text-white font-semibold"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
