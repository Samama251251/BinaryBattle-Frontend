"use client";
import React from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import { FaGoogle } from 'react-icons/fa';

const Page = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">
          Binary Battles
        </h1>
        
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-200 mb-6">
            Login to Your Account
          </h2>
          
          <button 
            onClick={() => signIn("google", { callbackUrl: '/' })}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-105"
          >
            <FaGoogle className="mr-2" />
            Continue with Google
          </button>
          
          <div className="mt-6 flex items-center justify-between">
            <hr className="w-full border-gray-600" />
            <span className="px-2 text-gray-400 text-sm">OR</span>
            <hr className="w-full border-gray-600" />
          </div>
          
          <form className="mt-6 space-y-4">
            <div>
              <input 
                type="email" 
                placeholder="Email" 
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <div>
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full px-4 py-3 rounded-lg bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Sign In
            </button>
          </form>
          
          <p className="mt-6 text-center text-gray-400">
            Don't have an account?{' '}
            <a href="#" className="text-pink-500 hover:underline">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;

