/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/search-bar";
import SearchResultItem from "@/components/searchResults";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LoginModal from "@/components/login-modal";
import CreateAccountModal from "@/components/create-account-modal";
import { useState, useEffect } from "react";
import AlbumResultItem from "@/components/albumResults";
import AuthButton from "@/components/auth-button";
import MenuButton from "@/components/menuButton";
import { addLike, removeLike, supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "genre";
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const [likedSongs, setLikedSongs] = useState<Record<string, boolean>>({});
  const router = useRouter();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Fetch initial likes from Supabase when the user is available
  useEffect(() => {
    const fetchLikes = async () => {
      if (!user) return;
      try {
        const { data: likes, error } = await supabase
          .from("likes")
          .select("item_id")
          .eq("user_id", user.id);
        if (error) throw error;
        const likedIds = likes.reduce((acc, like) => {
          acc[like.item_id] = true;
          return acc;
        }, {} as Record<string, boolean>);
        setLikedSongs(likedIds);
      } catch (error) {
        console.error("Error fetching likes:", error);
      }
    };
    fetchLikes();
  }, [user]);

  const handleSwitchToCreateAccount = () => {
    setLoginModalOpen(false);
    setCreateAccountModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setCreateAccountModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["releases", { query, type, from, to }],
    queryFn: () =>
      fetchReleases({
        dateRange: { from, to },
        [type]: query || undefined,
      }),
    enabled: !!query || !!from || !!to,
  });

  const results = data?.releases || [];
  const uniqueAlbumInfo: any = [];
  const uniqueIds = new Set();

  results
    ?.filter(
      (item: any) =>
        item.album?.album_type === "album" || item.album_type === "album"
    )
    ?.forEach((item: any) => {
      const title = item.album?.name;
      if (!uniqueIds.has(title)) {
        uniqueIds.add(title);
        uniqueAlbumInfo.push({
          id: item.id || item.album?.id,
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
          url: item.album?.external_urls?.spotify,
        });
      }
    });

  const trackInfo =
    results?.map((item: any, index: number) => ({
      id: index,
      title: item.name,
      artist: item.artists.map((a: any) => a.name).join(", "),
      album: item.type === "album" ? item.name : item.album.name,
      year: item.release_date
        ? item.release_date.split("-")[0]
        : item.album.release_date
        ? item.album.release_date.split("-")[0]
        : "Unknown",
      coverArt:
        item.album?.images[0]?.url ||
        item.images?.[0]?.url ||
        "/assets/placeholder.svg",
      genre:
        item.type === "track" && item.album.genres?.[0]
          ? item.album.genres[0]
          : "Unknown",
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

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: "local" });
    setUser(null);
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleLikeClick = async (
    e: React.MouseEvent,
    id: number,
    title: string,
    artist: string,
    coverArt: string,
    type: string,
    url: string,
    year: number
  ) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to save your likes");
      return;
    }

    try {
      const isCurrentlyLiked = likedSongs[id] || false;
      if (isCurrentlyLiked) {
        await removeLike(user.id, id.toString());
        toast.success("Removed from likes");
      } else {
        await addLike(user.id, { id: id.toString(), title, artist, coverArt, type, url, year });
        toast.success("Added to likes");
      }

      setLikedSongs((prev) => ({ ...prev, [id]: !isCurrentlyLiked }));
    } catch (error: any) {
      toast.error(error.message === 'duplicate key value violates unique constraint "unique_user_item"' ? "Already liked" : "Failed to update likes");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="z-1 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href={"/"} className="cursor-pointer flex items-center gap-1">
            <Image
              className="text-primary"
              src="/assets/Melodate Icon.jpg"
              alt="Melodate Icon"
              width={20}
              height={20}
              loading="lazy"
            />
            <h1 className="text-xl font-bold tracking-tight">Melodate</h1>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            {user && (
              <a href="/recent" className="text-sm font-medium hover:text-primary">
                Recent Searches
              </a>
            )}
            {user && (
              <a href="/likes" className="text-sm font-medium hover:text-primary">
                My Likes
              </a>
            )}
          </nav>
          <div className="flex items-center">
            <AuthButton onLoginClick={() => setLoginModalOpen(true)} />
            <div className="lg:hidden">
              <MenuButton
                user={user}
                onLoginClick={() => setDropdownOpen((prev) => !prev)}
              />
            </div>
          </div>
        </div>
      </header>
      <header className="sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container py-4">
          <SearchBar refetch={refetch} />
        </div>
      </header>

      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Search Results</h1>
          <p className="text-xs text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${results.length + uniqueAlbumInfo.length} results for "${query}"`}
          </p>
        </div>

        {isLoading ? (
          <div className="text-center text-muted-foreground">Loading results...</div>
        ) : results.length > 0 ? (
          <div>
            {uniqueAlbumInfo.length > 0 && (
              <h1 className="md:text-2xl font-bold my-4">Albums</h1>
            )}
            <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:space-y-0">
              {uniqueAlbumInfo.map(
                (
                  albumInfo: {
                    id: number;
                    title: string;
                    artist: string;
                    year: number;
                    coverArt: string;
                    type: string;
                    url: string;
                  },
                  index: number
                ) => (
                  <AlbumResultItem
                    key={`${albumInfo.title}-${index}`}
                    {...albumInfo}
                    isLiked={!!likedSongs[albumInfo.id]} // Pass isLiked state
                    handleLikeClick={handleLikeClick}
                  />
                )
              )}
            </div>
            {trackInfo.length > 0 && (
              <h1 className="md:text-2xl font-bold mt-10 mb-4">Tracks</h1>
            )}
            <div className="md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:space-y-0">
              {trackInfo.map(
                (
                  trackInfo: {
                    id: number;
                    title: string;
                    artist: string;
                    year: number;
                    coverArt: string;
                    type: string;
                    url: string;
                    genre: string;
                    album: string;
                  },
                  index: number
                ) => (
                  <SearchResultItem
                    key={`${trackInfo.title}-${index}`}
                    {...trackInfo}
                    isLiked={!!likedSongs[trackInfo.id]}
                    handleLikeClick={handleLikeClick}
                  />
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
      <footer className="border-t bg-muted relative z-50">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Melodate. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
            <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}