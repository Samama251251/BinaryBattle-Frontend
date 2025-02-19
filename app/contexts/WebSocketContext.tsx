'use client'
import React, { createContext, useContext, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface WebSocketContextType {
  socket: WebSocket | null;
}

const WebSocketContext = createContext<WebSocketContextType>({ socket: null });


export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [socket, setSocket] = React.useState<WebSocket | null>(null);

  useEffect(() => {
    if (!session?.user?.email) return;

    // Create WebSocket connection
    const ws = new WebSocket(`wss://samama.live/ws/chat/online/${session.user?.email.split('@')[0]}/`);
    console.log(ws);
    ws.onopen = () => {
      console.log('Connected to WebSocket');
      // Send user email when connection is established
      // ws.send(JSON.stringify({
      //   type: 'online',
      //   email: session.user?.email
      // }));
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket');
    };

    setSocket(ws);

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [session?.user?.email]);

  return (
    <WebSocketContext.Provider value={{ socket }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);