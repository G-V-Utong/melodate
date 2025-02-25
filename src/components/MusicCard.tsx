import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MusicCardProps {
  item: { name: string; artists: { name: string }[]; release_date: string; type: string };
}

export function MusicCard({ item }: MusicCardProps) {
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
    </Card>
  );
}