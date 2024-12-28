"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import IDE from "@/app/components/Editor";
import { problems } from "@/app/problems/problems";
import { toast } from "react-hot-toast";

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
  status: "active" | "completed";
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
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [consoleOutput, setConsoleOutput] = useState<string>("");
  const [consoleLoading, setConsoleLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Fetch challenge details
  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/challenges/${params.challengeId}`
        );
        if (!response.ok) {
          throw new Error("Challenge not found");
        }
        const data = await response.json();

        // Get problem details
        const problemDetails = problems.find(
          (p) => p.id === String(data.problem_id)
        );
        if (!problemDetails) {
          throw new Error("Problem not found");
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
          problemDetails: problemDetails,
        };

        setChallenge(challengeData);
        // Set the starter code from the problem details
        setCode(problemDetails.starterCode || "");
      } catch (error) {
        console.error("Error fetching challenge:", error);
        toast.error("Failed to load challenge");
        router.push("/challenges");
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

  // WebSocket connection
  useEffect(() => {
    if (!session?.user?.email || !params.challengeId) return;

    const websocket = new WebSocket(
      `ws://localhost:8000/ws/challenge/arena/${params.challengeId}/${session.user.email.split("@")[0]}/`
    );

    websocket.onopen = () => {
      console.log("Connected to WebSocket");
      // No need to send initial connection message as user details are now in URL
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "submission_update":
          // Show submission notification
          console.log("I am 1st one you want to see")

            if (data.status === 'submitted') {
              console.log("I am 2nd one you want to see")
              toast.loading(`${data.username} submitted their solution. Checking test cases...`, {duration: 10000});
            }
            
            // Update participants list when someone submits
            setChallenge((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                participants: prev.participants.map((p) =>
                  p.username === data.username 
                    ? { ...p, submissionTime: new Date().toISOString() } 
                    : p
                ),
              };
            });
          
          break;

        case "challenge_winner":
          // Show winner notification
          if (data.challengeId === params.challengeId) {
            const winner = challenge?.participants.find(
              (p) => p.username === data.username
            );
            toast.success(
              `${winner?.username || "Someone"} has won the challenge!`
            );
          }
          break;
      }
    };

    websocket.onclose = () => {
      console.log("Disconnected from WebSocket");
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    setWs(websocket);

    // Cleanup on unmount
    return () => {
      websocket.close();
    };
  }, [session?.user?.email, params.challengeId]);

  const handleSubmit = async () => {
    if (!challenge || !session?.user?.email || !ws) return;

    setSubmitting(true);
    setIsProcessing(true);
    setConsoleLoading(true);
    setConsoleOutput("Running your code...");

    try {
      // Notify others about new submission
      ws.send(
        JSON.stringify({
          type: "new_submission",
          data: {
            challengeId: challenge.id,
            username: session.user.email.split("@")[0],
          },
        })
      );

      // Get the problem details and test cases
      const problem = problems.find((p) => p.id === challenge.problemId);
      if (!problem) {
        throw new Error("Problem details not found");
      }

      // Submit code with test cases
      const submitResponse = await fetch(
        "http://localhost:8000/api/submissions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
            language: "python",
            challengeId: challenge.id,
            userEmail: session.user.email,
            testCases: problem.testCases.map((testCase) => ({
              input: testCase.input,
              output: testCase.output,
            })),
            problemId: challenge.problemId,
          }),
        }
      );

      if (!submitResponse.ok) {
        throw new Error("Submission failed");
      }

      const { token } = await submitResponse.json();

      // Poll for results
      let result;
      let dots = "";
      do {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const statusResponse = await fetch(
          `http://localhost:8000/api/submissions?token=${token}`
        );
        result = await statusResponse.json();

        // Update loading message with animated dots
        dots = dots.length >= 3 ? "" : dots + ".";
        setConsoleOutput(
          `Running your code${dots}\nPlease wait while we process your submission`
        );
      } while (result.status?.id === 1 || result.status?.id === 2);

      // Handle submission results
      if (result.status?.id === 3) {
        // Accepted
        const output = result.stdout?.trim() || "";
        const expectedOutput = problem.testCases[0].output.trim();
        const passed = output === expectedOutput;

        const testCaseOutput = `Test Case 1: ${passed ? "PASSED" : "FAILED"}
Input: ${problem.testCases[0].input}
Expected Output: ${expectedOutput}
Your Output: ${output}
Execution Time: ${result.time}s
Memory Used: ${result.memory}KB
${result.stderr ? `Error: ${result.stderr}` : ""}`;

        setConsoleOutput(testCaseOutput);

        if (passed) {
          toast.success("Solution accepted!");
        } else {
          toast.error("Output doesn't match expected result");
        }

        // After successful submission
        if (passed) {
          ws.send(
            JSON.stringify({
              type: "submission_completed",
              data: {
                challengeId: challenge.id,
                userEmail: session.user.email,
                score: result.time, // or whatever scoring metric you use
                status: "completed",
              },
            })
          );
        }
      } else {
        // Handle compilation/runtime errors
        const errorMessage =
          result.stderr ||
          result.compile_output ||
          result.message ||
          "An unknown error occurred";
        setConsoleOutput(errorMessage);
        toast.error("Execution failed");
      }
    } catch (error) {
      console.error("Error submitting code:", error);
      toast.error("Error submitting code");
      setConsoleOutput(
        (error as Error).message ||
          "An error occurred while submitting your code"
      );
    } finally {
      setSubmitting(false);
      setIsProcessing(false);
      setConsoleLoading(false);
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
          onClick={() => router.push("/challenges")}
        >
          Back to Challenges
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen relative">
      {/* Fullscreen loader overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-base-200 p-8 rounded-lg flex flex-col items-center gap-4">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="text-lg font-semibold">
              Processing your submission...
            </p>
          </div>
        </div>
      )}

      {/* Problem Description Panel */}
      <div className="w-1/3 p-4 bg-base-200 overflow-y-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="badge badge-primary">
              {challenge.problemDetails.difficulty}
            </span>
            {timeLeft !== null && (
              <span className="font-mono">
                Time Left: {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
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
              <p>
                <strong>Input:</strong> {testCase.input}
              </p>
              <p>
                <strong>Output:</strong> {testCase.output}
              </p>
              {testCase.explanation && (
                <p>
                  <strong>Explanation:</strong> {testCase.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Code Editor Panel */}
      <div className="flex-1 flex flex-col">
        <IDE
          value={code}
          onChange={(value: string | undefined) => setCode(value || "")}
          language="python"
          theme="dracula"
          title={challenge.title}
          difficulty={challenge.problemDetails.difficulty}
          onSubmit={handleSubmit}
          updateConsoleOutput={setConsoleOutput}
        />
        <div className="p-4 bg-base-300">
          <button
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={submitting || isProcessing}
          >
            {submitting || isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner loading-sm"></span>
                Processing...
              </span>
            ) : (
              "Submit Solution"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
