'use client'
import React from 'react'

function page() {
return (
    <section className='w-screen h-screen'>
        <div className='px-32 py-10 w-full h-full flex flex-col gap-3'>
            <h1 className='text-3xl font-bold'>ChatRoom</h1>

            {/* Chat Area */}
            <div className='bg-base-300 h-full w-full mx-5 mb-10 rounded-xl'>
                
            </div>

            {/* Message Input */}
            <div className='flex gap-3 fixed bottom-0 p-4 w-full'>
                <input type="text" className='input input-bordered w-5/6' placeholder='Type your message...' />
                <button className='btn btn-primary'>Send</button>
            </div>
        </div>
    </section>
)
}

export default page
