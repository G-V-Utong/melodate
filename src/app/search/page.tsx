"use client";

import { format } from "date-fns";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/search-bar";
import SearchResultItem from "@/components/searchResults";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const fetchReleases = async (filters: {
  dateRange?: { from?: string; to?: string };
  genre?: string;
  artist?: string;
}) => {
  const res = await fetch("/api/spotify/search", {
    method: "POST",
    body: JSON.stringify(filters),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export default function SearchResults() {
  // State to hold search filters (passed from SearchBar or URL)
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "genre"; // Default to genre
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["releases", { query, type, from, to }],
    queryFn: () =>
      fetchReleases({
        dateRange: { from, to },
        [type]: query || undefined,
      }),
    enabled: !!query || !!from || !!to, // Only fetch if there's a query or date range
  });
  console.log("Refetch function:", typeof refetch);
  // Map Spotify API results to SearchResultItem props
  console.log(data)
  const results = data?.releases?.map((item: any, index: number) => ({
    id: index, // Use index as a temporary ID since Spotify IDs might not be unique across types
    title: item.name,
    artist: item.artists.map((a: any) => a.name).join(", "),
    album: item.type === "album" ? item.name : item.album.name,
    year: item.release_date ? item.release_date.split("-")[0] : (item.album.release_date ?  item.album.release_date.split("-")[0] : 'Unknown' ), // Extract year from release_date
    coverArt: item.album?.images[0]?.url || item.images?.[0]?.url || "/assets/placeholder.svg",
    genre: item.type === "track" && item.album.genres?.[0] ? item.album.genres[0] : "Unknown", // Genre is often unavailable
    type: item.album_type ? (item.album_type === 'single' ? 'Track' : 'Album') : ( item.type ? ( item.type === 'album' ? 'Album' : 'Track'): 'Unknown'),
    url: item.external_urls.spotify
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href={'/'}>
        <div className="flex items-center gap-2 cursor-pointer">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">Melodate</h1>
        </div>
        </Link>
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
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <SearchBar refetch={refetch}/> {/* Pass refetch to SearchBar */}
        </div>
      </header>

      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading..." : `${results.length} results for "${query}"`}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading results...</div>
        ) : results.length > 0 ? (
          <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 space-y-4 md:space-y-0">
            {results.map((result: {
              id: number;
              title: string;
              artist: string;
              album: string;
              year: string;
              coverArt: string;
              genre: string;
              type: string;
            }) => (
              <SearchResultItem key={result.id} {...result} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4" />
            <p>No results found. Try adjusting your search terms.</p>
          </div>
        )}
      </main>
    </div>
  );
}