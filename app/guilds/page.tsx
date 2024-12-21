'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

function GuildsPage() {
  const { data: session, status } = useSession()
  const [userGuilds, setUserGuilds] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])

  useEffect(() => {
    if (status === 'authenticated') {
      // Fetch user's guilds
      // This is a placeholder. Replace with actual API call.
      fetchUserGuilds();
    }
  }, [status])

  const fetchUserGuilds = async () => {
    // Placeholder function. Replace with actual API call.
    const guilds = [
      { id: 1, name: 'Code Warriors' },
      { id: 2, name: 'Algorithm Avengers' },
      { id: 3, name: 'Binary Bandits' },
    ]
    setUserGuilds(guilds)
  }

  const searchGuilds = async (query) => {
    // Placeholder function. Replace with actual API call.
    const results = [
      { id: 4, name: 'Syntax Slayers' },
      { id: 5, name: 'Debug Dragons' },
      { id: 6, name: 'Query Questers' },
    ].filter(guild => guild.name.toLowerCase().includes(query.toLowerCase()))
    setSearchResults(results)
  }

  const handleSearch = (e) => {
    const query = e.target.value
    setSearchQuery(query)
    if (query.length > 2) {
      searchGuilds(query)
    } else {
      setSearchResults([])
    }
  }

  const joinGuild = async (guildId) => {
    // Placeholder function. Replace with actual API call.
    console.log(`Joined guild with id: ${guildId}`)
    // After joining, refresh user's guilds
    await fetchUserGuilds()
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Guilds</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Your Guilds</h2>
        {userGuilds.map(guild => (
          <div key={guild.id} className="bg-base-200 p-2 rounded mb-2">
            {guild.name}
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Find New Guilds</h2>
        <input
          type="text"
          placeholder="Search guilds..."
          value={searchQuery}
          onChange={handleSearch}
          className="input input-bordered w-full max-w-xs mb-4"
        />
        {searchResults.map(guild => (
          <div key={guild.id} className="bg-base-200 p-2 rounded mb-2 flex justify-between items-center">
            <span>{guild.name}</span>
            <button onClick={() => joinGuild(guild.id)} className="btn btn-primary btn-sm">
              Join
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GuildsPage

