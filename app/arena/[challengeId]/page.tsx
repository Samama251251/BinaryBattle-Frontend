"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import IDE from '@/app/components/Editor';
import { problems } from '@/app/problems/problems';
import { toast } from 'react-hot-toast';

interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: string;
  description: string;
  testCases: TestCase[];
  starterCode: string;
}

interface ArenaChallenge {
  id: string;
  title: string;
  problemId: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'active' | 'completed';
  participants: {
    email: string;
    username: string;
    score?: number;
    submissionTime?: string;
  }[];
  problemDetails: Problem;
}

export default function ArenaPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const [challenge, setChallenge] = useState<ArenaChallenge | null>(null);
  const [code, setCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Fetch challenge details
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/challenges/${params.challengeId}`);
        if (!response.ok) {
          throw new Error('Challenge not found');
        }
        const data = await response.json();
        
        // Get problem details
        const problemDetails = problems.find(p => p.id === String(data.problem_id));
        if (!problemDetails) {
          throw new Error('Problem not found');
        }

        const challengeData: ArenaChallenge = {
          id: data.id,
          title: data.title,
          problemId: String(data.problem_id),
          startTime: data.start_time,
          endTime: data.end_time,
          duration: data.duration,
          status: data.status,
          participants: data.participants,
          problemDetails: problemDetails
        };

        setChallenge(challengeData);
        setCode(problemDetails.starterCode);
      } catch (error) {
        console.error('Error fetching challenge:', error);
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

  // Timer logic
  useEffect(() => {
    if (!challenge?.startTime || !challenge?.duration) return;

    const updateTimer = () => {
      const start = new Date(challenge.startTime).getTime();
      const now = new Date().getTime();
      const duration = challenge.duration * 60 * 1000; // Convert minutes to milliseconds
      const remaining = duration - (now - start);

      if (remaining <= 0) {
        setTimeLeft(0);
        // Auto-submit logic here
        return;
      }

      setTimeLeft(Math.floor(remaining / 1000));
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [challenge]);

  const handleSubmit = async () => {
    if (!challenge || !session?.user?.email) return;

    setSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8000/api/challenges/${challenge.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          email: session.user.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Submission failed');
      }

      const result = await response.json();
      toast.success('Solution submitted successfully!');
      
      // Handle submission result
      // You might want to show test case results, score, etc.

    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit solution');
    } finally {
      setSubmitting(false);
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

  return (
    <div className="flex h-screen">
      {/* Problem Description Panel */}
      <div className="w-1/3 p-4 bg-base-200 overflow-y-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="badge badge-primary">{challenge.problemDetails.difficulty}</span>
            {timeLeft !== null && (
              <span className="font-mono">
                Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        </div>

        <div className="prose">
          <h3>Problem Description</h3>
          <p>{challenge.problemDetails.description}</p>

          <h3>Examples</h3>
          {challenge.problemDetails.testCases.map((testCase, index) => (
            <div key={index} className="bg-base-300 p-4 rounded-lg mb-4">
              <p><strong>Input:</strong> {testCase.input}</p>
              <p><strong>Output:</strong> {testCase.output}</p>
              {testCase.explanation && (
                <p><strong>Explanation:</strong> {testCase.explanation}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Code Editor Panel */}
      <div className="flex-1 flex flex-col">
        <IDE
          value={code}
          onChange={(value: string | undefined) => setCode(value || '')}
          language="python"
          theme="dracula"
        />
        <div className="p-4 bg-base-300">
          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Solution'}
          </button>
        </div>
      </div>
    </div>
  );
} 