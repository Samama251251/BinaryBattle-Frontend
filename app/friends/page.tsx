'use client'
import React,{useState, useEffect} from 'react'
import Link from 'next/link'

function Page() {
const [friendIsOnline, setFriendIsOnline] = useState<boolean>(true)
useEffect(() => {
    setFriendIsOnline(false)
}, [])

return (
    <section className='w-screen h-screen'>
        <div className='px-32 py-10 w-full h-full flex flex-col gap-3'>
            {/* Friends List */}
            <div className='flex flex-col w-3/4 h-fit bg-base-300 rounded-lg p-4'>
                <h1 className='text-3xl font-extrabold mb-10'>Friends</h1>
                <div className='flex flex-col gap-4'>
                    <div className='flex items-center gap-4 justify-between'>
                        {/* One particular Friend */}
                        <div className='flex gap-3'>
                            {friendIsOnline ? (

                                <div className="avatar online">
                                <div className="w-10 rounded-full">
                                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                                </div>
                            ):(
                            <div className="avatar offline">
                                <div className="w-10 rounded-full">
                                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                            </div>
                            </div>
                            )}
                            <div>
                                <h2 className='font-bold'>John Doe</h2>
                                <p className='text-xs font-light font-mono'>  
                                    johndoe
                                </p>
                        </div>
                        </div>
                        <div className='flex gap-1'>
                            <button className='btn btn-square btn-primary'>
                                <i className="fi fi-rs-two-swords text-xl"></i>
                            </button>
                            <Link className='btn btn-square btn-secondary' href="/message">
                                <i className="fi fi-rr-comment-alt text-xl"></i>
                            </Link>
                            <button className='btn btn-square btn-accent'>
                                <i className="fi fi-rr-user-xmark text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>    

            </div>

            {/* Make new Friends */}
            <div className='flex flex-col w-3/4 h-fit bg-base-300 rounded-lg p-4'>
                <h1 className='text-3xl font-extrabold mb-10'>Your Might be Friends</h1>
    
                <div className='flex flex-col gap-4'>
                    <div className='flex items-center gap-4 justify-between'>
                        {/* One particular Friend */}
                        <div className='flex gap-3'>
                                <div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                                </div>
                            <div>
                                <h2 className='font-bold'>John Doe</h2>
                                <p className='text-xs font-light font-mono'>  
                                    johndoe
                                </p>
                        </div>
                        </div>
                        <div className='flex gap-1'>
                            <button className='btn btn-accent'>
                                <i className="fi fi-rr-user-add text-xl"></i>
                                Add Friend
                            </button>
                            <button className='btn btn-secondary'>
                                <i className="fi fi-rr-cross text-md"></i>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>    

            </div>
        
        </div>
    </section>
    )
}

export default Page
