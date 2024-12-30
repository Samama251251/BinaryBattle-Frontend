'use client'
import React from 'react'
import Link from 'next/link'

import { useSession } from 'next-auth/react'

function Page() {
  const { data: session } = useSession()

  return (
    <section className='w-full min-h-screen bg-base-100 font-mono flex flex-col'>
      <div className='flex-1 flex flex-col items-center justify-center px-4 text-center'>
        {/* Welcome Text */}
        <h1 className='text-5xl font-bold mb-4'>
          Welcome to{' '}
          <span className='text-pink-400'>Binary Battles</span>
        </h1>
        
        <p className='text-xl text-base-content/70 max-w-2xl mb-12'>
          Challenge your coding skills, compete with friends, and become a better programmer through interactive coding battles.
        </p>

        {/* Action Buttons */}
        <div className='flex gap-6'>
          <Link 
            href="/challenges" 
            className='btn bg-pink-400 hover:bg-pink-500 border-none text-white btn-lg group transition-all duration-300 hover:scale-105'
          >
            <i className="fi fi-rs-two-swords text-2xl mr-2"></i>
            Join Challenges
            <span className='absolute -bottom-6 scale-0 group-hover:scale-100 transition-all duration-300 text-sm text-base-content/70'>
              Compete in coding battles
            </span>
          </Link>

          <Link 
            href="/friends"
            className='btn bg-violet-400 hover:bg-violet-500 border-none text-white btn-lg group transition-all duration-300 hover:scale-105'
          >
            <i className="fi fi-rr-users-alt text-2xl mr-2"></i>
            Find Friends
            <span className='absolute -bottom-6 scale-0 group-hover:scale-100 transition-all duration-300 text-sm text-base-content/70'>
              Connect with other coders
            </span>
          </Link>
        </div>

        {/* Stats Section */}
        <div className='flex gap-8 mt-24'>
          <div className='stats bg-base-200 shadow'>
            <div className='stat'>
              <div className='stat-title text-base-content/70'>Your Rank</div>
              <div className='stat-value text-pink-400'>
                {'Newbie'}
              </div>
              <div className='stat-desc'>Start competing to rank up!</div>
            </div>

            <div className='stat'>
              <div className='stat-title text-base-content/70'>Score</div>
              <div className='stat-value text-violet-400'>
                {'0'}
              </div>
              <div className='stat-desc'>Points earned from challenges</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className='relative w-full h-2'>
        <div className='absolute bottom-0 left-0 w-full h-full bg-gradient-to-r from-pink-400 to-violet-400 opacity-50'></div>
      </div>
    </section>
  )
}

export default Page