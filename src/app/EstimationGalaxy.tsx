import React from "react";

const players = [
  { name: "Erica", color: "green", vote: null },
  { name: "Ryan", color: "purple", vote: null },
  { name: "Player 3", color: "blue", vote: 3 },
  { name: "Player 4", color: "orange", vote: 5 },
];

const pointOptions = [1, 2, 3, 5, 8, 13, "?"];

export default function EstimationGalaxy() {
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white overflow-hidden">
      {/* Sprint Planet */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 shadow-2xl flex items-center justify-center text-xl font-bold border-4 border-purple-400">
          SPRINT PLANET
        </div>
      </div>

      {/* Spaceships */}
      {/* Top row */}
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex gap-10 z-20">
        {players.slice(0, 2).map((player, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-full bg-${player.color}-500 shadow-lg animate-pulse`} />
            <span className={`mt-2 bg-${player.color}-700 px-2 py-1 rounded-full text-sm`}>
              {player.vote ?? player.name}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="absolute bottom-32 left-1/4 transform -translate-x-1/2 flex flex-col items-center z-20">
        <div className="w-16 h-16 rounded-full bg-blue-500 shadow-lg animate-pulse" />
        <span className="mt-2 bg-blue-700 px-2 py-1 rounded-full text-sm">3</span>
      </div>
      <div className="absolute bottom-32 right-1/4 transform translate-x-1/2 flex flex-col items-center z-20">
        <div className="w-16 h-16 rounded-full bg-orange-500 shadow-lg animate-pulse" />
        <span className="mt-2 bg-orange-700 px-2 py-1 rounded-full text-sm">5</span>
      </div>

      {/* Vote Button */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20">
        <button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full text-lg shadow-xl">
          VOTE 5
        </button>
      </div>

      {/* Point Selection */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        {pointOptions.map((point, i) => (
          <button
            key={i}
            className="w-10 h-10 bg-gray-800 rounded-full hover:bg-pink-600 transition"
          >
            {point}
          </button>
        ))}
      </div>
    </div>
  );
}
