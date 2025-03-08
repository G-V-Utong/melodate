/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, MoreHorizontal } from "lucide-react"
import { addLike, removeLike, checkIfLiked, supabase } from "@/lib/supabase"
import { toast } from "sonner"
import { User } from "@supabase/supabase-js"
import { Badge } from "@/components/ui/badge"
import { AiOutlineSpotify } from "react-icons/ai"
import { useAuth } from "@/components/contexts/AuthContext";

interface MusicCardProps {
  id: string
  title: string
  artist: string
  coverArt: string
  url: string
  type: string
}

export function MusicCard({ id, title, artist, coverArt, url, type }: MusicCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const { user } = useAuth();

  useEffect(() => {
      if (user) {
        checkIfLiked(user.id, id).then(setIsLiked)
      }
    }, [id])

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if card is clickable
    
    if (!user) {
      toast.error("You must be logged in to save your likes")
      return
    }

    try {
      if (isLiked) {
        await removeLike(user.id, id)
        toast.success("Removed from likes")
      } else {
        await addLike(user.id, {
          id,
          title,
          artist,
          coverArt,
          type,
          url
        })
        toast.success("Added to likes")
      }
      setIsLiked(!isLiked)
    } catch (error: any) {
      toast.error(error.message === 'duplicate key value violates unique constraint "unique_user_item"' ? "Already liked" : "Failed to update likes");
    }
  }

  return (
    <Card className="overflow-hidden group">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full md:w-auto">
          <Image
            src={coverArt || "/assets/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button
              onClick={() => window.open(url)}
              size="icon"
              variant="secondary"
              className="rounded-full flex items-center justify-center gap-1 px-2 py-1 transition-all duration-300 group-hover:w-20 bg-[#1DB954] hover:bg-[#1DB954]"
            >
              <AiOutlineSpotify className="h-4 w-4 md:h-5 md:w-5 transition-all duration-300 group-hover:translate-x-0" />
              <span className="text-xs opacity-0 scale-x-0 whitespace-nowrap transition-all duration-300 group-hover:opacity-100 group-hover:scale-x-100 group-hover:translate-x-0">
                Spotify
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 md:px-4 pt-2 md:pt-4">
        <div className="space-y-0.5 md:space-y-1">
          <h4 className="font-medium text-sm md:text-base line-clamp-1">{title}</h4>
          <p className="text-xs md:text-sm text-muted-foreground line-clamp-1">{artist}</p>
        </div>
      </CardContent>
      <CardFooter className="p-2 md:p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[10px] md:text-xs px-1.5 py-0 md:px-2 md:py-0.5">
            {type === "album" ? "Album" : type === "ep" ? "EP" : "Single"}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 md:h-8 md:w-8"
            onClick={handleLikeClick}
          >
            <Heart className={`h-3 w-3 md:h-4 md:w-4 ${isLiked ? "fill-current text-red-500" : ""}`} />
          </Button>
          {/* <Button variant="ghost" size="icon" className="h-6 w-6 md:h-8 md:w-8">
            <MoreHorizontal className="h-3 w-3 md:h-4 md:w-4" />
          </Button> */}
        </div>
      </CardFooter>
    </Card>
  )
}