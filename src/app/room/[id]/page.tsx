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
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type Player = {
  name: string;
  vote: string | null;
};

const votingOptions = ['1', '2', '3', '5', '8', '13', '?'];

export default function RoomPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const [namePrompted, setNamePrompted] = useState(false);
  const [playerName, setPlayerName] = useState('');

  const [players, setPlayers] = useState<Player[]>([]);
  const [showVotes, setShowVotes] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const onRevealVotes = () => setShowVotes(true);

  const onResetVotes = () => {
    setPlayers((prev) => prev.map((p) => ({ ...p, vote: null })));
    setShowVotes(false);
    setHasVoted(false);
  };

  const votedCount = players.filter((p) => p.vote).length;

  const voteSummary = Array.from(
    players.reduce((map, p) => {
      if (p.vote && !isNaN(Number(p.vote))) {
        map.set(p.vote, (map.get(p.vote) || 0) + 1);
      }
      return map;
    }, new Map<string, number>()),
    ([vote, count]) => ({ vote, count })
  );

  const voteAverage = (
    players.reduce((sum, p) => sum + (parseFloat(p.vote || '') || 0), 0) /
    (votedCount || 1)
  ).toFixed(1);

  useEffect(() => {
    const queryName = searchParams.get('player');
    if (!queryName) {
      const name = prompt('Enter your name:') || 'Anonymous';
      setPlayerName(name);
    } else {
      setPlayerName(queryName);
    }
    setNamePrompted(true);
  }, []);

  useEffect(() => {
    if (!namePrompted || !playerName) return;

    const connect = async () => {
      try {
        const res = await fetch(`https://localhost:7293/api/rooms/${roomId}`);
        if (res.ok) {
          const data = await res.json();
          setPlayers(data.players);
        }

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
  }, [roomId, playerName, namePrompted]);

  useEffect(() => {
    if (players.length > 0 && players.every(p => p.vote)) {
      revealVotes(roomId);
    }
  }, [players]);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}?player=YourName`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 md:p-10 flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">Room: {roomId}</h1>

      <button
        onClick={handleCopy}
        className="mb-6 text-sm bg-gray-700 px-4 py-2 rounded-full hover:bg-gray-600 transition"
      >
        {copied ? 'Link Copied!' : 'Copy Invite Link'}
      </button>

      <div className="flex flex-col md:flex-row gap-8 w-full justify-center items-start">
        <div className="relative w-[350px] h-[350px] md:w-[500px] md:h-[500px]">
          {players.map((player, index) => {
            const angle = (index / players.length) * 2 * Math.PI;
            const radius = 140;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <div
                key={player.name}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 text-center"
                style={{ top: `calc(50% + ${y}px)`, left: `calc(50% + ${x}px)` }}
              >
                <img
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${player.name}`}
                  alt={player.name}
                  className="w-16 h-16 rounded-full mx-auto"
                />
                <div className="text-sm mt-2">{player.name}</div>

                <AnimatePresence>
                  {player.vote && (
                    <motion.div
                      className="mt-1 text-xl font-bold"
                      initial={{ rotateY: 180 }}
                      animate={{ rotateY: showVotes ? 0 : 180 }}
                      exit={{ rotateY: 180 }}
                      transition={{ duration: 0.6 }}
                    >
                      {showVotes ? player.vote : '✅'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {showVotes && (
          <div className="w-full md:w-[400px] h-[300px] bg-gray-800 rounded-xl p-4 shadow">
            <h2 className="text-lg font-semibold mb-2">Vote Summary</h2>
            <ResponsiveContainer width="100%" height="85%">
              <BarChart data={voteSummary}>
                <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                <XAxis dataKey="vote" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="count" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-2 text-center text-sm text-gray-300">
              Avg: {voteAverage}
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 mb-4 text-sm text-gray-300">
        {votedCount} / {players.length} voted
      </p>

      <div className="flex flex-wrap justify-center gap-4 mb-10">
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
