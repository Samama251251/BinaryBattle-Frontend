"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import toast from 'react-hot-toast';
import Link from "next/link";
import { FiArrowLeft, FiUserPlus, FiCheck, FiX, FiUsers } from 'react-icons/fi';

interface FriendRequest {
  id: string;
  senderUserName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  senderEmail: string;
}

// Add interface for API response
interface APIFriendRequest {
  id: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  sender_details: {
    email: string;
  };
}

function FriendRequestsPage() {
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchFriendRequests = async () => {
      if (!session?.user?.email) return;
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://samama.live/api/friendRequests?email=${session.user.email}`
        );
        if (response.ok) {
          const data = await response.json();
          // Transform the API response using the proper type
          const transformedData: FriendRequest[] = data.map((request: APIFriendRequest) => ({
            id: request.id.toString(),
            senderUserName: request.sender_details.email.split("@")[0],
            status: request.status,
            createdAt: request.created_at,
            senderEmail: request.sender_details.email
          }));
          setFriendRequests(transformedData);
        }
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFriendRequests();
  }, [session?.user?.email]);

  const handleFriendRequest = async (requestId: string, action: 'accept' | 'reject') => {
    if (!session?.user?.email) return;
    const request = friendRequests.find(req => req.id === requestId);
    if (!request) return;

    try {
      const response = await fetch(`https://samama.live/api/friendRequests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          action,
          receiverEmail: session.user.email,
          senderEmail: request.senderEmail
        }),
      });
      if (response.ok) {
        setFriendRequests(prev => prev.filter(req => req.id !== requestId));
        toast.success(`Friend request ${action}ed!`);
      }
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
      toast.error(`Failed to ${action} friend request`);
    }
  };
  return (
    <section className="w-screen h-screen">
      <div className="px-32 py-10 w-full h-full flex flex-col gap-3">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold">Friend Requests</h1>
          <Link href="/friends" className="btn btn-primary">
            <FiArrowLeft className="w-5 h-5" />
            Back to Friends
          </Link>
        </div>

        <div className="w-full bg-base-300 rounded-lg p-6">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : friendRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No pending friend requests</p>
              <Link href="/friends" className="btn btn-primary">
                <FiUsers className="w-5 h-5" />
                Find Friends
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {friendRequests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between bg-base-200 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-12 rounded-full bg-base-300">
                        <FiUserPlus className="w-full h-full p-2 text-gray-500" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{request.senderUserName}</p>
                      <p className="text-sm text-gray-500">
                        Received on {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-success"
                      onClick={() => handleFriendRequest(request.id, 'accept')}
                    >
                      <FiCheck className="w-5 h-5" />
                      Accept
                    </button>
                    <button
                      className="btn btn-error"
                      onClick={() => handleFriendRequest(request.id, 'reject')}
                    >
                      <FiX className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FriendRequestsPage;