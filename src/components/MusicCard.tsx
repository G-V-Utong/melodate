"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface MusicCardProps {
  title: string
  artist: string
  coverArt: string
  url: string
}

export function MusicCard({ title, artist, coverArt, url }: MusicCardProps) {
  return (
    <Card className="overflow-hidden border-0 bg-transparent hover:scale-105 transition-transform duration-200">
      <CardContent className="p-0">
        <a href={url} target="_blank" rel="noopener noreferrer" className="group block">
          <div className="relative aspect-square overflow-hidden rounded-lg shadow-lg">
            <Image
              src={coverArt}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              
            />
          </div>
          <div className="px-2 mt-2 min-w-0">
            <h3 className="font-medium leading-none line-clamp-1 truncate pb-2">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1 truncate">{artist}</p>
          </div>
        </a>
      </CardContent>
    </Card>
  )
}