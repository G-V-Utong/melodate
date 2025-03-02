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
  isLoading: boolean;
}

export default function MusicGrid({
  category,
  data,
  isLoading,
}: MusicGridProps) {
  // console.log(data);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold hidden md:inline-block">{category}</h3>
        <Button variant="link" className="text-sm">
          View All
        </Button>
      </div>

      <div className="flex md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {data?.map((item: any, index: number) => (
          <Card key={`${item.id}-${index}`} className="overflow-hidden group">
            <CardHeader className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={item.images?.[0]?.url || item.album?.images?.[0]?.url || "/assets/placeholder.svg"}
                  alt={`${item.name} by ${item.artist}`}
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
                  {item.album_type === 'album' ? 'Album' : (item.album_type === 'ep' ? 'EP' : 'Single')}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {item?.release_date?.split("-")[0] || item?.album?.release_date?.split("-")[0]}
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
