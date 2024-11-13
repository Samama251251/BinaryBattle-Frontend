'use client'
import React, { useEffect, useState, useRef } from 'react'

function Page() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const ws = useRef<WebSocket | null>(null)

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8000/ws/chat/room2/')

    ws.current.onopen = () => {
      console.log('Connected to WebSocket')
    }

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setMessages(prev => [...prev, data.message])
    }
    ws.current.onclose = () => {
      console.log('Disconnected from WebSocket')
    }

    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])

  const sendMessage = () => {
    if (ws.current && message.trim()) {
      // ws.current.send(JSON.stringify({
      //   type: 'message',
      //   message: message
      // }))
      ws.current.send(message)
      setMessage('')
    }
  }
  return (
    <section className='w-screen h-screen'>
      <div className='px-32 py-10 w-full h-full flex flex-col gap-3'>
        <h1 className='text-3xl font-bold'>ChatRoom</h1>

        {/* Chat Area */}
        <div className='bg-base-300 h-full w-full mx-5 mb-10 rounded-xl p-4 overflow-y-auto'>
          {messages.map((msg, index) => (
            <div key={index} className='bg-base-100 p-2 rounded-lg mb-2'>
              {msg}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className='flex gap-3 fixed bottom-0 p-4 w-full'>
          <input 
            type="text" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            className='input input-bordered w-5/6' 
            placeholder='Type your message...' 
          />
          <button 
            className='btn btn-primary'
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </section>
  )
}

export default Page
//  When component mounts:
// Component mounts
// ↓
// useEffect runs
// ↓
// WebSocket connects
// ↓
// Sets up event listeners (onopen, onmessage, onclose)
// ↓
// Ready to receive messages

// when message arrives:
// Server sends message
// ↓
// onmessage handler triggers
// ↓
// Updates messages state
// ↓
// Component re-renders with new message

// // When component unmounts:
// Component unmounts
// ↓
// Cleanup function runs
// ↓
// WebSocket closes

