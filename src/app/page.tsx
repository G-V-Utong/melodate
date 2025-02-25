"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MusicCard } from "@/components/MusicCard"; // Custom component

const fetchReleases = async (filters: {
  date: string;
  genre?: string;
  artist?: string;
  label?: string;
}) => {
  const res = await fetch("/api/spotify/search", {
    method: "POST",
    body: JSON.stringify(filters),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export default function Home() {
  const [filters, setFilters] = useState({
    date: "",
    genre: "",
    artist: "",
    label: "",
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["releases", filters],
    queryFn: () => fetchReleases(filters),
    enabled: false, // Trigger manually
  });

  const handleSearch = () => refetch();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Music Release Discovery</h1>
      
      {/* Search Form */}
      <div className="grid gap-4 mb-6 md:grid-cols-4">
        <Input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          placeholder="Release Date"
        />
        <Input
          value={filters.genre}
          onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
          placeholder="Genre"
        />
        <Input
          value={filters.artist}
          onChange={(e) => setFilters({ ...filters, artist: e.target.value })}
          placeholder="Artist"
        />
        <Input
          value={filters.label}
          onChange={(e) => setFilters({ ...filters, label: e.target.value })}
          placeholder="Label"
        />
      </div>
      <Button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </Button>

      {/* Results */}
      <div className="grid gap-4 mt-6 md:grid-cols-3">
        {data?.releases?.map((item: any) => (
          <MusicCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}