"use client";
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Challenge {
  id: string;
  title: string;
  problem: string;
  duration: number;
}

export default function ChallengesPage() {
  const [mode, setMode] = useState<'join' | 'create'>('join');
  const [challengeId, setChallengeId] = useState('');
  const [newChallenge, setNewChallenge] = useState<Partial<Challenge>>({
    title: '',
    problem: '',
    duration: 60// default 60 minutes
  });
  const availableProblems = [
    { id: '1', title: 'Sum of Two Numbers' },
    { id: '2', title: 'Even or Odd' },
    { id: '3', title: 'Reverse String' },
    { id: '4', title: 'Count Vowels' },
    { id: '5', title: 'Maximum of Three Numbers' }
  ];

  const { data: session } = useSession();
  const router = useRouter();

  const handleJoinChallenge = async() => {
    // Implement join challenge logic
    if (!challengeId) {
      toast.error("Please enter a challenge ID", {
        duration: 3000,
        position: "bottom-right",
        style: {
          background: "#333", 
          color: "#fff",
          borderRadius: "10px",
        },
      });
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/challenges/${challengeId}`);
      
      if (!response.ok) {
        throw new Error('Challenge not found');
      }

      router.push(`/lobby/${challengeId}`);
    } catch (error) {
      toast.error("Challenge not found", {
        duration: 3000,
        position: "bottom-right",
        style: {
          background: "#333",
          color: "#fff", 
          borderRadius: "10px",
        },
      });
    }
    console.log('Joining challenge:', challengeId);
  };
  const handleCreateChallenge = async () => {
    // Validate required fields
    if (!newChallenge.title || !newChallenge.problem || !newChallenge.duration) {
      toast.error("Please fill in all fields", {
        duration: 3000,
        position: "bottom-right",
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "10px",
        },
      });
      return;
    }

    try {
      // Format request body according to API expectations
      const requestBody = {
        title: newChallenge.title,
        problem: newChallenge.problem, // This will be used as problem_id in backend
        duration: newChallenge.duration,
        createdBy: session?.user?.email || '',
      };

      const response = await fetch("http://localhost:8000/api/challenges/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Challenge created successfully!", {
          duration: 3000,
          position: "bottom-right",
          style: {
            background: "#333",
            color: "#fff",
            borderRadius: "10px",
          },
        });
        // Reset form after successful creation
        setNewChallenge({
          title: '',
          problem: '',
          duration: 60,
        });
        router.push(`/lobby/${data.id}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create challenge");
      }
    } catch (error) {
      console.error("Error creating challenge:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create challenge", {
        duration: 3000,
        position: "bottom-right",
        style: {
          background: "#333",
          color: "#fff",
          borderRadius: "10px",
        },
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-center mb-8">Coding Challenges</h1>

      <div className="flex justify-center gap-4 mb-8">
        <button 
          className={`btn ${mode === 'join' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setMode('join')}
        >
          Join Challenge
        </button>
        <button 
          className={`btn ${mode === 'create' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setMode('create')}
        >
          Create Challenge
        </button>
      </div>

      {mode === 'join' ? (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Join Existing Challenge</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleJoinChallenge(); }}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Challenge ID</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter challenge ID"
                  className="input input-bordered w-full"
                  value={challengeId}
                  onChange={(e) => setChallengeId(e.target.value)}
                />
              </div>
              <button 
                className="btn btn-primary w-full mt-4"
                type="submit"
              >
                Join Challenge
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Create New Challenge</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateChallenge(); }}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Challenge Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter challenge title"
                  className="input input-bordered w-full"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                />
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Select Problem</span>
                </label>
                <select 
                  className="select select-bordered w-full"
                  value={newChallenge.problem}
                  onChange={(e) => setNewChallenge({ ...newChallenge, problem: e.target.value })}
                >
                  <option value="" disabled>Choose a problem</option>
                  {availableProblems.map((problem) => (
                    <option key={problem.id} value={problem.id}>
                      {problem.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control mt-4">
                <label className="label">
                  <span className="label-text">Duration (minutes)</span>
                </label>
                <input
                  type="number"
                  placeholder="Enter duration"
                  className="input input-bordered w-full"
                  value={newChallenge.duration}
                  onChange={(e) => setNewChallenge({ ...newChallenge, duration: Number(e.target.value) })}
                />
              </div>

              <button 
                className="btn btn-primary w-full mt-6"
                type="submit"
              >
                Create Challenge
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}