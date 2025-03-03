"use client"

import { useEffect, useState } from "react"

export default function Likes() {
  const [likes, setLikes] = useState([])

  useEffect(() => {
    // Load likes from your backend
    // Example: fetchLikes(user.id).then(setLikes)
  }, [])

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Liked Songs</h1>
      {/* Add your likes UI here */}
    </div>
  )
} 