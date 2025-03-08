/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { AiOutlineSpotify } from "react-icons/ai";
import { toast } from "sonner";
import { addLike, removeLike } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface MusicGridProps {
  category: string;
  data: any;
  isLoading: boolean;
  user: any;
}

export default function MusicGrid(
  { category, data, user }: MusicGridProps,
) {
  const [likedSongs, setLikedSongs] = useState<Record<string, boolean>>({});

  
  const handleLikeClick = async (
    e: React.MouseEvent,
    id: string,
    title: string,
    artist: string,
    coverArt: string,
    url: string,
    type: string
  ) => {
    e.preventDefault();
  
    if (!user) {
      toast.error("You must be logged in to save your likes");
      return;
    }
  
    try {
      const isCurrentlyLiked = likedSongs[id] || false;
  
      if (isCurrentlyLiked) {
        await removeLike(user.id, id);
        toast.success("Removed from likes");
      } else {
        await addLike(user.id, { id, title, artist, coverArt, type, url });
        toast.success("Added to likes");
      }
  
      setLikedSongs((prev) => ({ ...prev, [id]: !isCurrentlyLiked }));
      localStorage.setItem(
        "likedSongs",
        JSON.stringify({ ...likedSongs, [id]: !isCurrentlyLiked })
      );
    } catch (error: any) {
      toast.error(error.message === 'duplicate key value violates unique constraint "unique_user_item"' ? "Already liked" : "Failed to update likes");
    }
  };
  
  useEffect(() => {
    const storedLikes = localStorage.getItem("likedSongs");
    if (storedLikes) {
      setLikedSongs(JSON.parse(storedLikes));
    }
  }, []);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold hidden md:inline-block">
          {category}
        </h3>
        {/* <Button variant="link" className="text-sm">
          View All
        </Button> */}
      </div>

      <div className="flex md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.map((item: any, index: number) => (
          <Card key={`${item.id}-${index}`} className="overflow-hidden group">
          <CardHeader className="p-0">
            <div className="relative aspect-square">
              <Image
                src={
                  item.images?.[0]?.url ||
                  item.album?.images?.[0]?.url ||
                  "/assets/placeholder.svg"
                }
                alt={`${item.name} by ${item.artist}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index === 0}
                loading={index != 0 ? "lazy" : "eager"}
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  onClick={() => window.open(item.external_urls.spotify)}
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
          <CardContent className="px-4">
            <div className="space-y-1">
              <h4 className="font-medium line-clamp-1">{item.name}</h4>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {(item.artists || item.album?.artists || [])
                  .map((a: any) => a.name)
                  .join(", ")}
              </p>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {item.album_type === "album"
                  ? "Album"
                  : item.album_type === "ep"
                  ? "EP"
                  : "Single"}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {item?.release_date?.split("-")[0] ||
                  item?.album?.release_date?.split("-")[0]}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) =>
                  handleLikeClick(
                    e,
                    item.id,
                    item.name,
                    (item.artists || item.album?.artists || [])
                    .map((a: any) => a.name)
                    .join(", "),
                    item.images?.[0]?.url ||
                    item.album?.images?.[0]?.url ||
                    "/assets/placeholder.svg",
                    item.external_urls.spotify,
                    item.type || item.album.type
                  )
                }
              >
                <Heart className={`h-4 w-4 ${likedSongs[item.id] ? "fill-current text-red-500" : ""}`} />
              </Button>
              {/* <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button> */}
            </div>
          </CardFooter>
        </Card>
        ))}
      </div>
    </div>
  );
}
