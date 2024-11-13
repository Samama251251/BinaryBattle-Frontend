import React from 'react'
import Link from 'next/link'

function Header() {
return (
    <header className='flex w-screen bg-base-300 h-20 fixed p-4 font-mono items-center justify-between'>
        <nav>
            <ul className='flex'>
                <Link href="/" className='mx-4 hover:text-primary'>Home</Link>
                <Link href="/practice" className='mx-4 hover:text-primary'>Practice</Link>
                <Link href="/challenge" className='mx-4 hover:text-primary'>Challenge</Link>
            </ul>
        </nav>
        <div className='flex items-center gap-4'>
            <img src="/images/logo.png" className='w-14' alt="" />
            <h1 className='text-sm'>Binary <br /> <b className='text-primary text-2xl'>Battles</b></h1>
        </div>
        <div className='flex gap-2'>
            <button className='btn btn-primary'>Login</button>
            <button className='btn btn-secondary'>Sign Up</button>
        </div>
    </header>
)
}

export default Header
