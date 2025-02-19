'use client';
import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

function Page() {
  const params = useParams();
  const friendEmail = params.email as string;
  const [message, setMessage] = useState<string>('');
  const [userMessages, setUserMessages] = useState<{ id: string; text: string }[]>([]);
  const [messages, setMessages] = useState<{ id: string; text: string; source: string }[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!session || !session.user?.email) {
      console.log('Session not loaded yet or no user email');
      return;
    }

    const currentUsername = session.user.email.split("@")[0];
    const friendUsername = friendEmail.split("@")[0];
    
    // Sort usernames alphabetically to create consistent room ID
    const participants = [currentUsername, friendUsername].sort();
    const roomId = `${participants[0]}_${participants[1]}`;
    
    console.log('Room ID:', roomId);
    
    ws.current = new WebSocket(`wss://samama.live/ws/chat/${roomId}/`);

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
      setIsConnecting(false);
      setError(null);
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const isUserMessage = userMessages.some((msg) => msg.id === data.message.id);
      const isCurrentUser = data.sender === session?.user?.email?.split("@")[0];
    
      if (!isUserMessage && !isCurrentUser) {
        setMessages((prev) => [
          ...prev,
          { 
            id: uuidv4(),
            text: data.message, 
            source: data.sender,
            timestamp: data.timestamp
          },
        ]);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket');
      setIsConnecting(true);
    };

    ws.current.onerror = () => {
      setError('');
      setIsConnecting(false);
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [friendEmail, session]);

  const sendMessage = () => {
    if (ws.current && message.trim() && session?.user?.email) {
      const userMessage = { 
        id: uuidv4(), 
        text: message, 
        source: session.user.email.split("@")[0],
        to: friendEmail
      };
      
      ws.current.send(JSON.stringify(userMessage));
      setUserMessages((prev) => [...prev, userMessage]);
      setMessages((prev) => [...prev, userMessage]);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="w-screen h-screen bg-base-200">
      <div className="container mx-auto px-4 py-6 w-full h-full flex flex-col gap-4">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-2xl">Chat with {friendEmail}</h1>

            {isConnecting && <div className="loading loading-spinner loading-md"></div>}
            {error && <div className="alert alert-error">{error}</div>}

            {/* Chat Messages Area */}
            <div className="flex-1 overflow-y-auto min-h-[60vh] max-h-[60vh] rounded-lg">
              <div className="flex flex-col gap-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.source === session?.user?.email?.split("@")[0] 
                        ? 'justify-end' 
                        : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.source === session?.user?.email?.split("@")[0]
                          ? 'bg-primary text-primary-content'
                          : 'bg-base-300 text-base-content'
                      }`}
                    >
                      <div className="text-xs opacity-70 mb-1">{msg.source}</div>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input Area */}
            <div className="flex gap-2 mt-4">
              <textarea
                className="flex-1 textarea textarea-bordered textarea-primary min-h-[5rem]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={2}
              />
              <button
                className="btn btn-primary"
                onClick={sendMessage}
                disabled={!message.trim() || isConnecting}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Page;