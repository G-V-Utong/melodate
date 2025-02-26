import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabase"; 
import { Button } from "./ui/button";

interface MusicCardProps {
  item: {id: number; name: string; artists: { name: string }[]; release_date: string; type: string };
}

export function MusicCard({ item }: MusicCardProps) {
  const { data: session } = useSession();

  const saveFavorite = async () => {
    if (!session) return alert("Please log in");
    if (!session.user) return alert("User data not found");
    await supabase.from("favorites").insert({
      user_id: session.user.id,
      spotify_id: item.id,
      type: item.type,
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Artist: {item.artists.map((a) => a.name).join(", ")}</p>
        <p>Release Date: {item.release_date}</p>
        <p>Type: {item.type}</p>
      </CardContent>
      {session && <Button onClick={saveFavorite}>Save</Button>}
    </Card>
  );
}