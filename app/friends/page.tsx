"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface User {
  email: string;
  username: string;
  isOnline: boolean;
  score: number;
  rank: string;
}

function Page() {
  // State management
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { data: session } = useSession();

  // Fetch friends on component mount
  useEffect(() => {
    const fetchFriends = async () => {
      if (!session?.user?.email) return;

      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/friendship?username=${session?.user?.email.split("@")[0]}`
        );
        if (response.ok) {
          const data = await response.json();
          setFriends(data);
        }
      } catch (error) {
        console.error("Error fetching friends:", error);
      } finally {
        ``;
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [session?.user?.email]);

  // Search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]); // Clear results if search query is empty
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `http://localhost:8000/api/users?username=${encodeURIComponent(searchQuery)}`
      ); // Updated to use the search query
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        console.log("I came here")
        // Filter out current user and existing friends
        const filteredResults = data.filter(
          (user: User) =>
            user.email !== session?.user?.email &&
            !friends.some((friend) => friend.email === user.email)
        );
        setSearchResults(filteredResults); // Use filtered results
      
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Send friend request
  const sendFriendRequest = async (targetEmail: string) => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch(
        "http://localhost:8000/api/friend-requests",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromEmail: session.user.email,
            toEmail: targetEmail,
          }),
        }
      );

      if (response.ok) {
        // Remove the user from search results after sending request
        setSearchResults((prev) =>
          prev.filter((user) => user.email !== targetEmail)
        );
        alert("Friend request sent successfully!");
      } else {
        throw new Error("Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request");
    }
  };

  // Remove friend
  const removeFriend = async (friendEmail: string) => {
    if (!session?.user?.email) return;

    try {
      const response = await fetch("http://localhost:8000/api/friends/remove", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail: session.user.email,
          friendEmail: friendEmail,
        }),
      });

      if (response.ok) {
        setFriends((prev) =>
          prev.filter((friend) => friend.email !== friendEmail)
        );
        alert("Friend removed successfully!");
      } else {
        throw new Error("Failed to remove friend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      alert("Failed to remove friend");
    }
  };

  return (
    <section className="w-screen h-screen">
      <div className="px-32 py-10 w-full h-full flex flex-col gap-3">
        {/* Search Users */}
        <div className="flex flex-col w-3/4 h-fit bg-base-300 rounded-lg p-4">
          <h1 className="text-3xl font-extrabold mb-4">Find Friends</h1>
          <div className="relative flex gap-2">
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="input input-bordered w-full mb-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="btn btn-primary mb-4"
              onClick={handleSearch}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <i className="fi fi-rr-search text-xl"></i>
              )}
              Search
            </button>
          </div>

          {searchResults.length > 0 && (
            <div className="flex flex-col gap-4">
              {searchResults.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center gap-4 justify-between"
                >
                  <div className="flex gap-3">
                    <div className="avatar">
                      <div className="w-10 rounded-full">
                      </div>
                    </div>
                    <div>
                    
                      <p className="text-xs font-light font-mono">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    className="btn btn-accent"
                    onClick={() => sendFriendRequest(user.email)}
                  >
                    <i className="fi fi-rr-user-add text-xl"></i>
                    Add Friend
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Friends List */}
        <div className="flex flex-col w-3/4 h-fit bg-base-300 rounded-lg p-4">
          <h1 className="text-3xl font-extrabold mb-10">Your Friends</h1>
          {isLoading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : friends.length === 0 ? (
            <p className="text-center text-gray-500">
              No friends yet. Start by searching for users above!
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {friends.map((friend) => (
                <div
                  key={friend.email}
                  className="flex items-center gap-4 justify-between"
                >
                  <div className="flex gap-3">
                    <div
                      className={`avatar ${
                        friend.isOnline ? "online" : "offline"
                      }`}
                    >
                      <div className="w-10 rounded-full">

                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-light font-mono">
                        {friend.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="btn btn-square btn-primary">
                      <i className="fi fi-rs-two-swords text-xl"></i>
                    </button>
                    <Link
                      className="btn btn-square btn-secondary"
                      href={`/message/${friend.email}`}
                    >
                      <i className="fi fi-rr-comment-alt text-xl"></i>
                    </Link>
                    <button
                      className="btn btn-square btn-accent"
                      onClick={() => removeFriend(friend.email)}
                    >
                      <i className="fi fi-rr-user-xmark text-xl"></i>
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

export default Page;
