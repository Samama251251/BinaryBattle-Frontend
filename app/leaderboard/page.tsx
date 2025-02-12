'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface UserScore {
  username: string;
  score: number;
}

export default function LeaderboardPage() {
  const [scores, setScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch('http://3.224.195.199/api/updateScore');
        if (!response.ok) {
          throw new Error('Failed to fetch scores');
        }
        const data = await response.json();
        setScores(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-300">
        <div className="text-xl loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-300">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-base-300">
      <h1 className="text-6xl font-bold mb-12 text-center text-primary">Leaderboard</h1>
      <div className="max-w-4xl mx-auto">
        <div className="bg-base-100 rounded-box shadow-lg overflow-hidden">
          <table className="table w-full text-lg">
            <thead>
              <tr>
                <th className="bg-primary text-primary-content">Rank</th>
                <th className="bg-primary text-primary-content">Username</th>
                <th className="bg-primary text-primary-content">Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score, index) => (
                <motion.tr 
                  key={score.username}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={index % 2 === 0 ? 'bg-base-200' : 'bg-base-100'}
                >
                  <td className="font-bold py-4 text-xl">
                    {index + 1}
                    {index < 3 && (
                      <span className="ml-2 text-2xl">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                      </span>
                    )}
                  </td>
                  <td className="py-4">{score.username}</td>
                  <td className="py-4">
                    <div className="flex items-center">
                      <span className="font-mono text-accent font-bold text-xl">{score.score}</span>
                      <progress 
                        className="progress progress-accent w-36 ml-4" 
                        value={score.score} 
                        max={Math.max(...scores.map(s => s.score))}
                      ></progress>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

