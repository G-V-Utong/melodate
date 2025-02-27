"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MusicCard } from "@/components/MusicCard"; // Custom component
import { Search } from "lucide-react";
import SearchBar from "@/components/search-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MusicGrid from "@/components/music-grid";
import LoginModal from "@/components/login-modal";

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
  const data = await res.json();
  console.log("API Response:", data); // ✅ Log the JSON response
  return data;
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

  const [loginModalOpen, setLoginModalOpen] = useState(false)

  return (
    // <div className="container mx-auto p-4">
    //   <h1 className="text-2xl font-bold mb-4">Music Release Discovery</h1>
      
    //   {/* Search Form */}
    //   <div className="grid gap-4 mb-6 md:grid-cols-4">
    //     <Input
    //       type="date"
    //       value={filters.date}
    //       onChange={(e) => setFilters({ ...filters, date: e.target.value })}
    //       placeholder="Release Date"
    //     />
    //     <Input
    //       value={filters.genre}
    //       onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
    //       placeholder="Genre"
    //     />
    //     <Input
    //       value={filters.artist}
    //       onChange={(e) => setFilters({ ...filters, artist: e.target.value })}
    //       placeholder="Artist"
    //     />
    //     <Input
    //       value={filters.label}
    //       onChange={(e) => setFilters({ ...filters, label: e.target.value })}
    //       placeholder="Label"
    //     />
    //   </div>
    //   <Button onClick={handleSearch} disabled={isLoading}>
    //     {isLoading ? "Searching..." : "Search"}
    //   </Button>

    //   {/* Results */}
    //   <div className="grid gap-4 mt-6 md:grid-cols-3">
    //     {data?.releases?.map((item: any) => (
    //       <MusicCard key={item.id} item={item} />
    //     ))}
    //   </div>
    // </div>
    <div className="min-h-screen bg-background">
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Melodate</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary">
            Discover
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary">
            New Releases
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary">
            Top Charts
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary">
            Playlists
          </a>
        </nav>
        <div className="flex items-center">
            <button
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              onClick={() => setLoginModalOpen(true)}
            >
              Login
          </button>
        </div>
      </div>
    </header>

    <main className="container py-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight">Find Your Perfect Music</h2>
          <p className="text-muted-foreground">
            Search by artist, label, genre, or release date to discover your next favorite track
          </p>
        </div>

        <SearchBar />

        <Tabs defaultValue="trending">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new-releases">New Releases</TabsTrigger>
            <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
            <TabsTrigger value="recommended">Recommended</TabsTrigger>
          </TabsList>
          <TabsContent value="trending" className="mt-6">
            <MusicGrid category="Trending" />
          </TabsContent>
          <TabsContent value="new-releases" className="mt-6">
            <MusicGrid category="New Releases" />
          </TabsContent>
          <TabsContent value="top-rated" className="mt-6">
            <MusicGrid category="Top Rated" />
          </TabsContent>
          <TabsContent value="recommended" className="mt-6">
            <MusicGrid category="Recommended" />
          </TabsContent>
        </Tabs>
      </div>
    </main>
    <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    <footer className="border-t bg-muted/40">
      <div className="container py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© 2024 Melodate. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
  );
}