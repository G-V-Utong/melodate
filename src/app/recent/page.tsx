/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getRecentSearches, supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginModal from "@/components/login-modal";
import CreateAccountModal from "@/components/create-account-modal";
import { Search, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import AuthButton from "@/components/auth-button";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";
import { format } from "date-fns/format";
import { capitalizeWords } from "@/lib/helperFunctions";
import MenuButton from "@/components/menuButton";
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

interface SearchHistoryItem {
  id: string;
  query: string;
  search_type: string;
  date_range: { from?: string; to?: string };
  created_at: string;
}

export default function RecentSearches() {
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "genre"; // Default to genre
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleSwitchToCreateAccount = () => {
    setLoginModalOpen(false);
    setCreateAccountModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setCreateAccountModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleLoginSuccess = (userData: any) => {
    setUser(userData); // Set user data on successful login
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
          url: item.album?.external_urls?.spotify,
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

  useEffect(() => {
    async function fetchSearches() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user) {
          const searches = await getRecentSearches(user.id);
          setRecentSearches(searches);
        }
      } catch (error) {
        toast.error("Unable to fetch Recent Searches");
      } finally {
        setLoading(false);
      }
    }

    fetchSearches();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut({ scope: 'local' })
    setUser(null); // Clear user state
    localStorage.removeItem("user"); // Remove user data from localStorage
  };

  // Add this function for development/debugging
  async function logAllSearches() {
    const { data, error } = await supabase
      .from("search_history")
      .select("*, auth.users(email)")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error fetching searches");
      return;
    }

    console.table(data);
  }

  // Call it in useEffect or add a debug button
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      logAllSearches();
    }
  }, []);

  const handleSearchClick = (search: SearchHistoryItem) => {
    const params = new URLSearchParams();
    if (search.query) params.set("q", search.query);
    if (search.search_type) params.set("type", search.search_type);
    if (search.date_range?.from) params.set("from", search.date_range.from);
    if (search.date_range?.to) params.set("to", search.date_range.to);

    router.push(`/search?${params.toString()}`);
  };

  if (loading) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href={"/"} className="cursor-pointer flex items-center gap-1">
            <img
              className="text-primary"
              src="/assets/Melodate Icon.jpg"
              alt="Melodate Icon"
              width={20}
              height={20}
              loading="lazy"
            />
            <h1 className="text-xl font-bold tracking-tight">Melodate</h1>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            {user ? (
              <a
                href="/recent"
                className="text-sm font-medium hover:text-primary"
              >
                Recent Searches
              </a>
            ) : (
              ""
            )}
            {user ? (
              <a
                href="/recent"
                className="text-sm font-medium hover:text-primary"
              >
                My Likes
              </a>
            ) : (
              ""
            )}
          </nav>
          <div className="flex items-center">
            <AuthButton
              onLoginClick={() => setLoginModalOpen(true)}
            />
            <div className="lg:hidden">
              <MenuButton
                user={user}
                onLoginClick={() => setDropdownOpen((prev) => !prev)}
              />
            </div>
          </div>
        </div>
      </header>
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* <div className="container py-4">
          <SearchBar refetch={refetch} /> 
        </div> */}
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isVisible={!!user} />
        <main
          className={cn(
            "flex-1 overflow-y-auto",
            user ? "md:w-[calc(100%-300px)]" : ""
          )}
        >
          <div
            className={cn(
              "flex-1 overflow-y-auto md:px-10 lg:px-0",
              user ? "lg:w-[calc(100%-300px)] lg:ml-[300px]" : ""
            )}
          >
            <div className="container py-8">
              <h1 className="text-2xl font-bold mb-6">Recent Searches</h1>
              {user ? <div className="space-y-4">
                {recentSearches ? (
                  recentSearches.map((search) => (
                    <Button
                      key={search.id}
                      variant="outline"
                      className="w-full justify-start text-left py-8"
                      onClick={() => handleSearchClick(search)}
                    >
                      <div className="flex items-center gap-4">
                        {search.search_type === "date" ? (
                          <Calendar className="h-4 w-4" />
                        ) : (
                          <Search className="h-4 w-4" />
                        )}
                        <div>
                          <p className="font-medium mb-1">
                            {capitalizeWords(search.query) || "Date Search"}
                          </p>
                          <div className="text-xs text-muted-foreground md:flex md:justify-between w-full">
                            {search.date_range?.from ? (
                              <p className="mb-1 md:mb-0">
                                {format(new Date(search.date_range.from), "PP")}
                                {search.date_range.to &&
                                  ` - ${format(
                                    new Date(search.date_range.to),
                                    "PP"
                                  )}`}
                              </p>
                            ) : <p className="mb-1 md:mb-0">No date provided</p>}
                            <p className="md:ml-2 md:text-right">
                              Searched:{" "}
                              {format(new Date(search.created_at), "PP")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Button>
                  ))
                ) : (
                  <p>
                    You currently don&apos;t have any searches. Search for music
                    by artist or genre to begin
                  </p>
                )}
              </div> : <p className="text-center text-muted-foreground">You must be signed in to view your recent searches.</p>}
            </div>
          </div>
        </main>
      </div>
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
