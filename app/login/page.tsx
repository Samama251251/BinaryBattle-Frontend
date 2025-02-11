'use client'

import React from 'react'
import { signIn } from "next-auth/react"
import { FaGoogle, FaDiscord, FaGamepad } from 'react-icons/fa'
import { RiSwordLine } from 'react-icons/ri'
import { motion } from 'framer-motion'

const Page = () => {
  return (
    <>
      {/* Dark overlay with animated gradient */}
      <div 
        className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        style={{ 
          zIndex: 100,
          background: 'radial-gradient(circle at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%)'
        }}
      />
      
      {/* Login container */}
      <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 101 }}>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-lg relative bg-[#1a1a1a] rounded-2xl p-8"
          style={{
            boxShadow: '0 0 60px rgba(138, 43, 226, 0.3)',
            border: '1px solid rgba(138, 43, 226, 0.2)',
          }}
        >
          <div className="relative">
            {/* Decorative corner elements */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-l-2 border-t-2 border-purple-500/50"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-r-2 border-t-2 border-purple-500/50"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-l-2 border-b-2 border-purple-500/50"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r-2 border-b-2 border-purple-500/50"></div>

            {/* Title with gradient and animation */}
            <motion.h1 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-5xl font-bold text-center mb-4"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Binary
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                Battles
              </span>
            </motion.h1>
            
            <h2 className="text-xl font-medium text-center text-gray-400 mb-8">
              Access Your Battle Station
            </h2>

            {/* Stats section */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-lg bg-purple-500/10">
                <div className="text-2xl font-bold text-purple-400">0K</div>
                <div className="text-sm text-gray-400">Active Players</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-blue-500/10">
                <div className="text-2xl font-bold text-blue-400">50+</div>
                <div className="text-sm text-gray-400">Battles</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-pink-500/10">
                <div className="text-2xl font-bold text-pink-400">24/7</div>
                <div className="text-sm text-gray-400">Live Action</div>
              </div>
            </div>
            
            {/* Login buttons */}
            <div className="space-y-4">
              <button 
                onClick={() => signIn("google", { callbackUrl: '/' })}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
              >
                <FaGoogle className="mr-3 text-xl" />
                <span className="tracking-wide">Continue with Google</span>
              </button>

              <button 
                onClick={() => signIn("discord", { callbackUrl: '/' })}
                className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-[#5865F2]/25"
              >
                <FaDiscord className="mr-3 text-xl" />
                <span className="tracking-wide">Continue with Discord</span>
              </button>
            </div>

            {/* Features section */}
            <div className="mt-8 pt-8 border-t border-purple-500/20">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 text-gray-400">
                  <FaGamepad className="text-purple-500 text-xl" />
                  <span>Real-time Battles</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-400">
                  <RiSwordLine className="text-blue-500 text-xl" />
                  <span>Let&apos;s Code Together</span>
                </div>
              </div>
            </div>

            {/* Animated stars */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{
                    duration: Math.random() * 3 + 2,
                    repeat: Infinity,
                    delay: Math.random() * 3
                  }}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: Math.random() * 2 + 1 + 'px',
                    height: Math.random() * 2 + 1 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Page

