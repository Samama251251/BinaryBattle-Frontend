"use client";
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiUsers, FiClock, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { problems } from '@/app/problems/problems';

interface Participant {
  email: string;
  username: string;
  isReady: boolean;
  joinedAt: string;
}

interface Challenge {
  id: string;
  title: string;
  problemId: string;
  createdBy: string;
  startTime: string | null;
  duration: number;
  participants: Participant[];
  status: 'waiting' | 'starting' | 'active';
  problemDetails: {
    title: string;
    difficulty: string;
    description: string;
    examples: {
      input: string;
      output: string;
      explanation: string;
    }[];
    constraints: string[];
    starterCode: string;
  };
}

const getProblemDetails = (problemId: string) => {
  
  console.log('Available problems:', problems);
  console.log('Looking for problem with ID:', problemId);
  const problem = problems.find(p => p.id === problemId);
  console.log('Found problem:', problem);
  return problem;
};

function useWebSocket(challengeId: string, userEmail: string | null, onMessage: (data: any) => void) {
  const wsRef = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    if (!challengeId || !userEmail) return;

    const username = encodeURIComponent(userEmail.split('@')[0]);
    const ws = new WebSocket(`ws://localhost:8000/ws/challenge/lobby/${challengeId}/${username}/`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast.error('Connection error occurred');
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
      wsRef.current = null;
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [challengeId, userEmail, onMessage]);

  return wsRef;
}

export default function LobbyPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const messageHandlerRef = useRef<(data: any) => void>();
  
  // Store message handler in ref to keep it stable
  messageHandlerRef.current = useCallback((data: any) => {
    console.log('WebSocket message received:', data);

    switch (data.type) {
      case 'ready_status_update':
        setChallenge(prev => {
          if (!prev) return null;
          const updatedParticipants = prev.participants.map(p =>
            p.username === data.username ? { ...p, isReady: data.isReady } : p
          );
          return { ...prev, participants: updatedParticipants };
        });
        break;

      case 'user_join_leave':
        setChallenge(prev => {
          if (!prev) return null;
          if (data.action === 'joined') {
            if (!prev.participants.some(p => p.username === data.username)) {
              const newParticipant: Participant = {
                email: `${data.username}@example.com`,
                username: data.username,
                isReady: false,
                joinedAt: new Date().toISOString()
              };
              toast.success(`${data.username} joined the lobby`);
              return {
                ...prev,
                participants: [...prev.participants, newParticipant]
              };
            }
          } else if (data.action === 'left') {
            toast.success(`${data.username} left the lobby`);
            return {
              ...prev,
              participants: prev.participants.filter(p => p.username !== data.username)
            };
          }
          return prev;
        });
        break;

      case 'challenge_started':
        setChallenge(prev => prev ? {
          ...prev,
          startTime: data.startTime,
          status: 'starting'
        } : null);

        let count = 5;
        setCountdown(count);
        const timer = setInterval(() => {
          count--;
          setCountdown(count);
          if (count === 0) {
            clearInterval(timer);
            router.push(`/challenges/${params.challengeId}/solve`);
          }
        }, 1000);
        break;
    }
  }, [router, params.challengeId]);

  // Use the custom hook with stable message handler
  const wsRef = useWebSocket(
    params.challengeId as string,
    session?.user?.email ?? null,
    useCallback((data) => {
      messageHandlerRef.current?.(data);
    }, [])
  );

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        console.log('Fetching challenge with ID:', params.challengeId);
        const response = await fetch(`http://localhost:8000/api/challenges/${params.challengeId}`);
        if (!response.ok) {
          throw new Error('Challenge not found');
        }
        const data = await response.json();
        console.log('API Response:', data);
        
        // Transform snake_case to camelCase and ensure problemId is the correct type
        const transformedData = {
          id: data.id,
          title: data.title,
          problemId: String(data.problem_id),
          createdBy: data.created_by,
          startTime: data.start_time,
          duration: data.duration,
          participants: data.participants,
          status: data.status
        };
        console.log('Transformed data:', transformedData);
        
        const problemDetails = getProblemDetails(transformedData.problemId);
        console.log('Problem details found:', problemDetails);
        
        if (!problemDetails) {
          console.error('Problem not found with ID:', transformedData.problemId);
          throw new Error(`Problem not found with ID: ${transformedData.problemId}`);
        }

        const finalChallenge = {
          ...transformedData,
          problemDetails: {
            title: problemDetails.title,
            difficulty: problemDetails.difficulty,
            description: problemDetails.description,
            examples: [{
              input: problemDetails.testCases[0].input,
              output: problemDetails.testCases[0].output,
              explanation: "Example case"
            }],
            constraints: [],
            starterCode: problemDetails.starterCode
          }
        };
        console.log('Final challenge object:', finalChallenge);
        
        setChallenge(finalChallenge);
      } catch (error) {
        console.error('Detailed error:', error);
        toast.error('Failed to load challenge');
        router.push('/challenges');
      } finally {
        setLoading(false);
      }
    };

    if (params.challengeId) {
      fetchChallenge();
    }
  }, [params.challengeId, router]);

  // Update toggleReady to use wsRef
  const toggleReady = async () => {
    try {
      // Get current username consistently
      const username = session?.user?.email?.split('@')[0];
      if (!username) return;

      const response = await fetch(`http://localhost:8000/api/challenges/${params.challengeId}/ready`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isReady: !isReady,
          username: username
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update ready status');
      }

      // Update local state first
      setIsReady(!isReady);
      
      // Send WebSocket message
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'ready_status',
          username: username,
          isReady: !isReady
        }));
      }

    } catch (error) {
      console.error('Error updating ready status:', error);
      toast.error('Failed to update ready status');
    }
  };

  // Update startChallenge to use wsRef
  const startChallenge = async () => {
    if (!challenge) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/challenges/${params.challengeId}/start`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start challenge');
      }

      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'challenge_start',
          startTime: new Date().toISOString()
        }));
      }

      // Start countdown
      let count = 5;
      setCountdown(count);
      const timer = setInterval(() => {
        count--;
        setCountdown(count);
        if (count === 0) {
          clearInterval(timer);
          router.push(`/challenges/${params.challengeId}/solve`);
        }
      }, 1000);
    } catch (error) {
      console.error('Error starting challenge:', error);
      toast.error('Failed to start challenge');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold mb-4">Challenge not found</h2>
        <button 
          className="btn btn-primary"
          onClick={() => router.push('/challenges')}
        >
          Back to Challenges
        </button>
      </div>
    );
  }

  const allReady = challenge.participants.every(p => p.isReady);
  const isCreator = challenge.createdBy === session?.user?.email;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{challenge.title}</h1>
        <div className="flex items-center gap-4 text-gray-500 mt-2">
          <span className="flex items-center gap-2">
            <FiUsers />
            {challenge.participants.length} Participants
          </span>
          <span className="flex items-center gap-2">
            <FiClock />
            {challenge.duration} minutes
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex gap-8">
        {/* Left side - Problem Description */}
        <div className="flex-grow">
          <h2 className="text-xl font-semibold mb-4">Problem Description</h2>
          <div className="bg-base-200 p-6 rounded-lg">
            <p className="mb-4">{challenge.problemDetails.description}</p>
            
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Example:</h3>
              {challenge.problemDetails.examples.map((example, index) => (
                <div key={index} className="bg-base-300 p-3 rounded-md mb-2">
                  <p><strong>Input:</strong> {example.input}</p>
                  <p><strong>Output:</strong> {example.output}</p>
                  <p><strong>Explanation:</strong> {example.explanation}</p>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-2">Constraints:</h3>
              <ul className="list-disc list-inside">
                {challenge.problemDetails.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right side - Participants */}
        <div className="w-80">
          <h2 className="text-xl font-semibold mb-4">Participants</h2>
          <div className="space-y-2 mb-6">
            {challenge.participants.map((participant) => (
              <div 
                key={participant.email}
                className="flex items-center justify-between p-3 bg-base-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className="avatar placeholder">
                    <div className="bg-base-300 rounded-full w-8 h-8">
                      <span>{participant.username[0].toUpperCase()}</span>
                    </div>
                  </div>
                  <span>{participant.username}</span>
                </div>
                {participant.isReady ? (
                  <FiCheckCircle className="text-success w-5 h-5" />
                ) : (
                  <FiXCircle className="text-error w-5 h-5" />
                )}
              </div>
            ))}
          </div>

          {/* Ready and Start Buttons */}
          <div className="space-y-3">
            {!isCreator && (
              <button 
                className={`btn btn-block ${isReady ? 'btn-error' : 'btn-success'}`}
                onClick={toggleReady}
              >
                {isReady ? 'Not Ready' : 'Ready'}
              </button>
            )}
            
            {countdown !== null && (
              <div className="text-center text-2xl font-bold">
                Starting in {countdown}...
              </div>
            )}
            
            <button 
              className="btn btn-primary btn-block"
              disabled={!allReady || countdown !== null || !isCreator}
              onClick={startChallenge}
            >
              {isCreator ? 'Start Challenge' : 'Waiting for host...'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}