import React from 'react'

function Sidebar() {
return (
    <section className='bg-base-300 h-screen w-fit px-3 py-4 flex flex-col justify-between'>
        <div className='flex flex-col items-center gap-3'>
        <img src="./images/logo.png" alt="logo" className='w-16' />
        <h1 className='text-center font-bold'>Binary <br />Battles</h1>
        <span className='divider'></span>

        {/* Home Button */}
        <div className='tooltip tooltip-right' data-tip = "Home">
            <button className='btn btn-square btn-ghost'>
                <i className="fi fi-br-home text-2xl"></i>
            </button>
        </div>
            
         {/* Challenge Button */}
        <div className='tooltip tooltip-right' data-tip = "Challenges">
            <button className='btn btn-square btn-ghost'>
                <i className="fi fi-rs-two-swords text-2xl"></i>
            </button>
        </div>

         {/* Practice Button */}
        <div className='tooltip tooltip-right' data-tip = "Practice">
            <button className='btn btn-square btn-ghost'>
                <i className="fi fi-rr-bullseye-arrow text-2xl"></i>
            </button>
        </div>

         {/* Leaderboard Button */}
        <div className='tooltip tooltip-right' data-tip = "Leaderboard">
            <button className='btn btn-square btn-ghost'>
                <i className="fi fi-rr-ranking-star text-2xl"></i>
            </button>
        </div>

         {/* Friends Button */}
        <div className='tooltip tooltip-right' data-tip = "Friends">
            <button className='btn btn-square btn-ghost'>
                <i className="fi fi-rr-users-alt text-2xl"></i>
            </button>
        </div>
        </div>
        
        <div className='tooltip tooltip-top' data-tip='Account'>
            <button className='btn btn-ghost btn-circle'>
                <img src="./images/logo.png" alt="logo" className='w-16' />
            </button>
        </div>
    </section>
)
}

export default Sidebar
