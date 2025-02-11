'use client'
import React from 'react'
import { useSession } from 'next-auth/react'

function Page() {
const {data : session} =  useSession()
return (
    <section className='w-screen h-screen bg-base-100 font-mono'>
        <section className='flex py-10 px-32'>
            <h1>{session?.user?.email}</h1>
        </section>
    </section>
)
}
export default Page
