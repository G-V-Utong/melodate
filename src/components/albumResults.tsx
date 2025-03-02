import Image from "next/image"
import { Play, Heart, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { AiOutlineSpotify } from "react-icons/ai"


interface AlbumResultItemProps {
  id: number
  title: string
  artist: string
  year: string
  coverArt: string
  type: string
  url: string
}

export default function AlbumResultItem({ id, title, artist, year, coverArt, type, url }: AlbumResultItemProps) {

  return (
    <>
      {/* Card view for web */}
      <Card className="overflow-hidden group hidden md:block">
        <CardHeader className="p-0">
          <div className="relative aspect-square">
            <Image
              src={coverArt || "/assets/placeholder.svg"}
              alt={`${type} cover`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button onClick={() => window.open(url)}
                    size="icon"
                    variant="secondary"
                    className="rounded-full flex items-center justify-center gap-1 px-2 py-1 transition-all duration-300 group-hover:w-20 bg-[#1DB954] hover:bg-[#1DB954]"
                  >
                    <AiOutlineSpotify className="h-5 w-5 transition-all duration-300 group-hover:translate-x-0 " />
                    <span className="text-xs opacity-0 scale-x-0 whitespace-nowrap transition-all duration-300 group-hover:opacity-100 group-hover:scale-x-100 group-hover:translate-x-0">
                      Spotify
                    </span>
                  </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-1">
            <h4 className="font-medium line-clamp-1">{title}</h4>
            <p className="text-sm text-muted-foreground line-clamp-1">{artist}</p>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {type}
            </Badge>
            <span className="text-xs text-muted-foreground">{year}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* List view for mobile */}
      <div className="flex items-center space-x-4 p-4 bg-card hover:bg-accent rounded-lg transition-colors md:hidden">
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image src={coverArt || "/placeholder.svg"} alt={`${type} cover`} fill className="object-cover rounded-md" />
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <p className="text-sm text-muted-foreground truncate">{artist}</p>
          <p className="text-sm text-muted-foreground truncate">
            {type} ({year})
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="icon" variant="ghost">
            <Play className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost">
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )
}