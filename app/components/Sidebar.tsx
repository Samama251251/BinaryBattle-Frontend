'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

function Sidebar() {
const { data: session, status } = useSession()
useEffect(() => {
    if (status === 'loading') return
}, [session, status])
return (
    <section className='bg-base-300 h-screen w-fit px-3 py-4 flex flex-col justify-between fixed'>
        <div className='flex flex-col items-center gap-3'>
        <img src="./images/logo.png" alt="logo" className='w-16' />
        <h1 className='text-center font-bold font-mono'>Binary <br />Battles</h1>
        <span className='divider'></span>

        {/* Home Button */}
        <div className='tooltip tooltip-right' data-tip = "Home">
            <Link className='btn btn-square btn-ghost' href="/">
                <i className="fi fi-br-home text-2xl"></i>
            </Link>
        </div>
            
         {/* Challenge Button */}
        <div className='tooltip tooltip-right' data-tip = "Challenges">
            <Link className='btn btn-square btn-ghost' href="/challenges">
                <i className="fi fi-rs-two-swords text-2xl"></i>
            </Link>
        </div>

         {/* Practice Button */}
        <div className='tooltip tooltip-right' data-tip = "Practice">
            <Link className='btn btn-square btn-ghost' href="/practice">
                <i className="fi fi-rr-bullseye-arrow text-2xl"></i>
            </Link>
        </div>

         {/* Leaderboard Button */}
        <div className='tooltip tooltip-right' data-tip = "Leaderboard">
            <Link className='btn btn-square btn-ghost' href="/leaderboard">
                <i className="fi fi-rr-ranking-star text-2xl"></i>
            </Link>
        </div>

         {/* Friends Button */}
        <div className='tooltip tooltip-right' data-tip = "Friends">
            <Link className='btn btn-square btn-ghost' href="friends">
                <i className="fi fi-rr-users-alt text-2xl"></i>
            </Link>
        </div>
        </div>

        {/* Account */}
        <div className='tooltip tooltip-top' data-tip='Account'>
            <Link className='btn btn-ghost btn-circle' href="account">
                <img src={session?.user?.image || "/images/logo.png"} alt="logo" className='w-16 rounded-full' />
            </Link>
        </div>
    </section>
)
}

export default Sidebar
