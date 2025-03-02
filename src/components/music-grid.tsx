import Image from "next/image";
import { Play, Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AiOutlineSpotify } from "react-icons/ai";

interface MusicGridProps {
  category: string;
  data: any;
  isLoading: boolean
}

export default function MusicGrid({ category, data, isLoading }: MusicGridProps) {
  // Mock data - in a real app, this would come from an API
  // console.log(data)
  const musicItems = [
    {
      id: 1,
      title: "Midnight Memories",
      artist: "The Weeknd",
      genre: "R&B",
      coverArt: "/assets/placeholder.svg?height=300&width=300",
      releaseDate: "2023",
      label: "Universal",
    },
    {
      id: 2,
      title: "Electric Dreams",
      artist: "Daft Punk",
      genre: "Electronic",
      coverArt: "/assets/placeholder.svg?height=300&width=300",
      releaseDate: "2021",
      label: "Columbia",
    },
    {
      id: 3,
      title: "Golden Hour",
      artist: "Kacey Musgraves",
      genre: "Country Pop",
      coverArt: "/assets/placeholder.svg?height=300&width=300",
      releaseDate: "2018",
      label: "Universal",
    },
    {
      id: 4,
      title: "Future Nostalgia",
      artist: "Dua Lipa",
      genre: "Pop",
      coverArt: "/assets/placeholder.svg?height=300&width=300",
      releaseDate: "2020",
      label: "Warner",
    },
    {
      id: 5,
      title: "To Pimp a Butterfly",
      artist: "Kendrick Lamar",
      genre: "Hip Hop",
      coverArt: "/assets/placeholder.svg?height=300&width=300",
      releaseDate: "2015",
      label: "Def Jam",
    },
    {
      id: 6,
      title: "Blue Banisters",
      artist: "Lana Del Rey",
      genre: "Alternative",
      coverArt: "/assets/placeholder.svg?height=300&width=300",
      releaseDate: "2021",
      label: "Sony Music",
    },
    {
      id: 7,
      title: "Currents",
      artist: "Tame Impala",
      genre: "Psychedelic Rock",
      coverArt: "/assets/placeholder.svg?height=300&width=300",
      releaseDate: "2015",
      label: "Universal",
    },
    {
      id: 8,
      title: "Blonde",
      artist: "Frank Ocean",
      genre: "R&B",
      coverArt: "/assets/placeholder.svg?height=300&width=300",
      releaseDate: "2016",
      label: "Def Jam",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">{category}</h3>
        <Button variant="link" className="text-sm">
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {musicItems.map((item) => (
          <Card key={item.id} className="overflow-hidden group">
            <CardHeader className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={item.coverArt || "/placeholder.svg"}
                  alt={`${item.title} by ${item.artist}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
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
                <h4 className="font-medium line-clamp-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {item.artist}
                </p>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {item.genre}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {item.releaseDate}
                </span>
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
        ))}
      </div>
    </div>
  );
}
