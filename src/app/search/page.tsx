"use client";

import { format } from "date-fns";
import { Heading1, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/search-bar";
import SearchResultItem from "@/components/searchResults";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import LoginModal from "@/components/login-modal";
import CreateAccountModal from "@/components/create-account-modal";
import { useState } from "react";
import AlbumResultItem from "@/components/albumResults";

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
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);

  const handleSwitchToCreateAccount = () => {
    setLoginModalOpen(false);
    setCreateAccountModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setCreateAccountModalOpen(false);
    setLoginModalOpen(true);
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["releases", { query, type, from, to }],
    queryFn: () =>
      fetchReleases({
        dateRange: { from, to },
        [type]: query || undefined,
      }),
    enabled: !!query || !!from || !!to, // Only fetch if there's a query or date range
  });
  // Map Spotify API results to SearchResultItem props
  const results = data?.releases || [];

  const uniqueAlbumInfo = [];
  const uniqueIds = new Set(); // Use a Set to track unique IDs

  const albumInfo = results
    ?.filter(
      (item: any) =>
        item.album?.album_type === "album" || item.album_type === "album"
    )
    ?.forEach((item: any) => {
      const title = item.album?.name; // Use a unique identifier (e.g., `id` or `name`)
      if (!uniqueIds.has(title)) {
        // Check if the item is already in the Set
        uniqueIds.add(title); // Add the ID to the Set
        uniqueAlbumInfo.push({
          // Add the item to the array
          title: item.album?.name,
          artist: (item.artists || item.album?.artists || [])
            .map((a: any) => a.name)
            .join(", "),
          year: item.release_date
            ? item.release_date.split("-")[0]
            : item.album?.release_date
            ? item.album.release_date.split("-")[0]
            : "Unknown",
          type: "Album",
          coverArt:
            item.images?.[0]?.url ||
            item.album?.images?.[0]?.url ||
            "/assets/placeholder.svg",
          url:
            item.album?.external_urls?.spotify,
        });
      }
    });

  const trackInfo =
    results?.map((item: any, index: number) => ({
      id: index, // Use index as a temporary ID since Spotify IDs might not be unique across types
      title: item.name,
      artist: item.artists.map((a: any) => a.name).join(", "),
      album: item.type === "album" ? item.name : item.album.name,
      year: item.release_date
        ? item.release_date.split("-")[0]
        : item.album.release_date
        ? item.album.release_date.split("-")[0]
        : "Unknown", // Extract year from release_date
      coverArt:
        item.album?.images[0]?.url ||
        item.images?.[0]?.url ||
        "/assets/placeholder.svg",
      genre:
        item.type === "track" && item.album.genres?.[0]
          ? item.album.genres[0]
          : "Unknown", // Genre is often unavailable
      type: item.album_type
        ? item.album_type === "single"
          ? "Track"
          : "Album"
        : item.type
        ? item.type === "album"
          ? "Album"
          : "Track"
        : "Unknown",
      url: item.external_urls.spotify,
    })) || [];

  return (
    <div className="min-h-screen bg-background">
      <header className="z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href={"/"}>
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
          <SearchBar refetch={refetch} /> {/* Pass refetch to SearchBar */}
        </div>
      </header>

      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Search Results</h1>
          <p className="text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${
                  results.length + uniqueAlbumInfo.length
                } results for "${query}"`}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">
            Loading results...
          </div>
        ) : results.length > 0 ? (
          <div>
            {uniqueAlbumInfo && (
              <h1 className="text-2xl font-bold my-4">Albums</h1>
            )}
            <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 space-y-4 md:space-y-0">
              {uniqueAlbumInfo.map(
                (albumInfo: {
                  id: number;
                  title: string;
                  artist: string;
                  album: string;
                  year: string;
                  coverArt: string;
                  genre: string;
                  type: string;
                  url: string;
                }) => (
                  <AlbumResultItem key={albumInfo.id} {...albumInfo} />
                )
              )}
            </div>
            {trackInfo && (
              <h1 className="text-2xl font-bold mt-10 mb-4">Tracks</h1>
            )}
            <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 space-y-4 md:space-y-0">
              {trackInfo.map(
                (trackInfo: {
                  id: number;
                  title: string;
                  artist: string;
                  year: string;
                  coverArt: string;
                  type: string;
                  url: string;
                  genre: string;
                  album: string;
                }) => (
                  <SearchResultItem key={trackInfo.id} {...trackInfo} />
                )
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <Search className="mx-auto h-12 w-12 mb-4" />
            <p>No results found. Try adjusting your search terms.</p>
          </div>
        )}
      </main>
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToCreateAccount={handleSwitchToCreateAccount}
      />
      <CreateAccountModal
        isOpen={createAccountModalOpen}
        onClose={() => setCreateAccountModalOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </div>
  );
}
