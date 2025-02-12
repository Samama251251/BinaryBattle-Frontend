'use client';
import React, { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid'; 

function Page() {
  const [message, setMessage] = useState<string>('');
  const [userMessages, setUserMessages] = useState<{ id: string; text: string }[]>([]); // Tracks user-sent messages
  const [messages, setMessages] = useState<{ id: string; text: string; source: 'server' | 'user' }[]>([]); // Tracks all messages
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket('ws://3.224.195.199/ws/chat/room2/');

    ws.current.onopen = () => {
      console.log('Connected to WebSocket');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data.message.text)
      // Check if the message ID already exists in userMessages
      const isUserMessage = userMessages.some((msg) => msg.id === data.id);
    
      if (!isUserMessage) {
        setMessages((prev) => [
          ...prev,
          { id: data.id, text: data.text, source: 'server' },
        ]);
      }
    };
    
    

    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

const sendMessage = () => {
  if (ws.current && message.trim()) {


    const userMessage = { id: uuidv4(), text: message, source: 'user' as const };

    // Send message with unique ID to the server
    ws.current.send(JSON.stringify(userMessage));

    // Add to user messages
    setUserMessages((prev) => [...prev, userMessage]);
    setMessages((prev) => [...prev, userMessage]);

    setMessage('');
  }
};


  return (
    <section className="w-screen h-screen">
      <div className="px-32 py-10 w-full h-full flex flex-col gap-3">
        <h1 className="text-3xl font-bold">ChatRoom</h1>

        {/* Chat Area */}
        <div className="overflow-x-auto mb-8 h-full bg-base-300 rounded-xl px-4 py-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat ${msg.source === 'user' ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Avatar"
                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                  />
                </div>
              </div>
              <div className="chat-bubble">{msg.text}</div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-3 fixed bottom-0 p-4 w-full">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className="input input-bordered w-5/6"
            placeholder="Type your message..."
          />
          <button className="btn btn-primary" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </section>
  );
}

export default Page;
