'use client'

import React from 'react'
import { signIn } from "next-auth/react"
import { FaGoogle } from 'react-icons/fa'

const Page = () => {
  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm" style={{ zIndex: 100 }}></div>
      
      {/* Login container */}
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 101 }}>
        <div 
          className="w-full max-w-md relative bg-[#1a1a1a] rounded-2xl p-8"
          style={{
            boxShadow: '0 0 60px rgba(138, 43, 226, 0.3)',
            border: '1px solid rgba(138, 43, 226, 0.2)',
          }}
        >
          <div className="relative">
            {/* Title with gradient */}
            <h1 className="text-4xl font-bold text-center mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Binary
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                .Battles
              </span>
            </h1>
            
            <h2 className="text-xl font-medium text-center text-gray-400 mb-8">
              Access Your Battle Station
            </h2>
            
            {/* Login button */}
            <button 
              onClick={() => signIn("google", { callbackUrl: '/' })}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              <FaGoogle className="mr-3 text-xl" />
              <span className="tracking-wide">Continue with Google</span>
            </button>

            {/* Animated stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(15)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute bg-white rounded-full animate-twinkle"
                  style={{
                    width: Math.random() * 2 + 1 + 'px',
                    height: Math.random() * 2 + 1 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDelay: Math.random() * 3 + 's'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Page
