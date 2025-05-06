'use client';

import { useRouter } from 'next/navigation';
import EstimationGalaxy from './EstimationGalaxy';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-5xl font-bold mb-12">Scrum Poker</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <button
          onClick={() => router.push('/create')}
          className="bg-blue-600 hover:bg-blue-700 p-6 rounded-xl text-xl font-semibold shadow-lg w-64"
        >
          Create Room
        </button>

        <button
          onClick={() => router.push('/join')}
          className="bg-green-600 hover:bg-green-700 p-6 rounded-xl text-xl font-semibold shadow-lg w-64"
        >
          Join Room
        </button>
      </div>
    </div>
  );
}
