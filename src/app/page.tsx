/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useAuth } from "@/components/contexts/AuthContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MusicCard } from "@/components/MusicCard"; // Custom component
import { Search } from "lucide-react";
import SearchBar from "@/components/search-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MusicGrid from "@/components/music-grid";
import LoginModal from "@/components/login-modal";
import CreateAccountModal from "@/components/create-account-modal";
import { useSearchParams } from "next/navigation";
import {
  fetchTrending,
  fetchNewReleases,
  fetchTopRated,
  fetchRecommended,
} from "@/app/api/spotify/spotify";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AuthButton from "@/components/auth-button";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { cn } from "@/lib/utils";
import MenuButton from "@/components/menuButton";
import { supabase } from "@/lib/supabase";

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
  return data;
};

export default function Home() {
  const [filters, setFilters] = useState({
    dateRange: "",
    genre: "",
    artist: "",
    label: "",
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [createAccountModalOpen, setCreateAccountModalOpen] = useState(false);
  const { user, loading, logout } = useAuth();
    

  const handleSwitchToCreateAccount = () => {
    setLoginModalOpen(false);
    setCreateAccountModalOpen(true);
  };

  const handleSwitchToLogin = () => {
    setCreateAccountModalOpen(false);
    setLoginModalOpen(true);
  };

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const type = searchParams.get("type") || "genre"; // Default to genre
  const from = searchParams.get("from") || undefined;
  const to = searchParams.get("to") || undefined;

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["releases", { query, type, from, to }],
    queryFn: () =>
      fetchReleases({
        date: `${from} - ${to}`,
        [type]: query || undefined,
      }),
    enabled: !!query || !!from || !!to, // Only fetch if there's a query or date range
  });

  // Map Spotify API results to SearchResultItem props
  const results =
    data?.releases?.map((item: any, index: number) => ({
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

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ["trending"],
    queryFn: fetchTrending,
  });
  const { data: newReleases, isLoading: newReleasesLoading } = useQuery({
    queryKey: ["new-releases"],
    queryFn: fetchNewReleases,
  });
  const { data: topRated, isLoading: topRatedLoading } = useQuery({
    queryKey: ["top-rated"],
    queryFn: fetchTopRated,
  });
  const { data: recommended, isLoading: recommendedLoading } = useQuery({
    queryKey: ["recommended"],
    queryFn: fetchRecommended,
  });

  const handleLogout = async () => {
    await logout();
  };

  

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href={"/"} className="cursor-pointer flex items-center gap-1">
            <img className="text-primary" src="/assets/Melodate Icon.jpg" alt="Melodate Icon" width={20} height={20} loading="lazy"/>
            <h1 className="text-xl font-bold tracking-tight">Melodate</h1>
          </Link>
          <nav className="hidden lg:flex items-center gap-6">
            {user ? <a href="/recent" className="text-sm font-medium hover:text-primary">
              Recent Searches
            </a> : ''}
            {user ? <a href="/likes" className="text-sm font-medium hover:text-primary">
              My Likes
            </a> : ''}
          </nav>
          <div className="flex items-center">
            <AuthButton
              onLoginClick={() => setLoginModalOpen(true)}
            />
           {user && <div className="lg:hidden">
           <MenuButton
              user={user}
              onLoginClick={() => setDropdownOpen((prev) => !prev)}
            />
           </div>}
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isVisible={!!user} />
        <main className={cn(
          "flex-1 overflow-y-auto py-8 md:px-10 lg:px-0",
          user ? "lg:w-[calc(100%-300px)] lg:ml-[300px]" : ""
        )}>
          <div className={cn(
            "mx-auto max-w-5xl px-4",
            user ? "lg:mr-[100px] 2xl:mr-auto 2xl:max-w-[1200px]" : "",
            "3xl:pl-[150px]"
          )}>
            <div className="space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl md:text-[40px] font-bold tracking-tight">
                Relive the Soundtrack of Any Moment!
                </h2>
                <p className="text-base md:text-lg text-muted-foreground ">
                Search for songs and albums released on any day in history. Whether it&apos;s your <span className="font-[700] text-foreground">birth year</span>, a special <span className="font-[700] text-foreground">anniversary</span>, or a throwback to a <span className="font-[700] text-foreground">golden era</span>, find the music that defined the moment.
                </p>
              </div>

              <SearchBar refetch={refetch} />

              <Tabs defaultValue="trending" className="hidden md:block">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="new-releases">New Releases</TabsTrigger>
                  <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                </TabsList>

                <TabsContent value="trending" className="mt-6">
                  <MusicGrid
                    category="Trending"
                    data={trending?.tracks?.items.map((item: any) => item.track)}
                    isLoading={trendingLoading}
                    user={user}
                  />
                </TabsContent>

                <TabsContent value="new-releases" className="mt-6">
                  <MusicGrid
                    category="New Releases"
                    data={newReleases?.albums?.items}
                    isLoading={newReleasesLoading}
                    user={user}
                  />
                </TabsContent>

                <TabsContent value="top-rated" className="mt-6">
                  <MusicGrid
                    category="Top Rated"
                    data={topRated?.tracks?.items.map((item: any) => item.track)}
                    isLoading={topRatedLoading}
                    user={user}
                  />
                </TabsContent>

                <TabsContent value="recommended" className="mt-6">
                  <MusicGrid
                    category="Recommended"
                    data={recommended?.tracks?.items.map((item: any) => item.track)}
                    isLoading={recommendedLoading}
                    user={user}
                  />
                </TabsContent>
              </Tabs>
              <div className="md:hidden space-y-4">
                <div className="">
                  <h2 className="text-2xl font-semibold px-4">Trending</h2>
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent className="-ml-2">
                        {trending?.tracks?.items.map((item: any, index: any) => (
                          <CarouselItem key={index} className="pl-2 basis-[45%]">
                            <MusicCard
                              id={item.id || item.track.id}
                              title={item.name || item.track.name}
                              artist={
                                item.artists
                                  ? item.artists
                                      .map((artist: any) => artist.name)
                                      .join(", ")
                                  : item.track.artists
                                      .map((artist: any) => artist.name)
                                      .join(", ")
                              }
                              coverArt={
                                item.album?.images[0]?.url ||
                                item.track?.album?.images[0]?.url
                              }
                              url={
                                item.external_urls?.spotify ||
                                item.track?.external_urls?.spotify
                              }
                              type={item.album_type
                                ? item.album_type === "single"
                                  ? "Track"
                                  : "Album"
                                : item.track?.type
                                ? item.track?.type === "album"
                                  ? "Album"
                                  : "Track"
                                : "Unknown"}
                              year={ item?.release_date?.split("-")[0] ||
                                item?.track?.album?.release_date?.split("-")[0]}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 border border-border h-8 w-8" />
                      <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 border border-border h-8 w-8" />
                    </Carousel>
                  </div>
                </div>

                <div className="">
                  <h2 className="text-2xl font-semibold px-4">New Releases</h2>
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent className="-ml-2">
                        {newReleases?.albums?.items.map((item: any, index: any) => (
                          <CarouselItem key={index} className="pl-2 basis-[45%]">
                            <MusicCard
                              id={item.id}
                              title={item.name}
                              artist={item.artists
                                .map((artist: any) => artist.name)
                                .join(", ")}
                              coverArt={item.images[0]?.url || "/assets/placeholder.svg"}
                              url={item.external_urls.spotify}
                              type={item.album_type
                                ? item.album_type === "single"
                                  ? "Track"
                                  : "Album"
                                : item.track?.type
                                ? item.track?.type === "album"
                                  ? "Album"
                                  : "Track"
                                : "Unknown"}
                                year={item?.release_date?.split("-")[0] ||
                                  item?.track?.album?.release_date?.split("-")[0]}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 border border-border h-8 w-8" />
                      <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 border border-border h-8 w-8" />
                    </Carousel>
                  </div>
                </div>

                <div className="">
                  <h2 className="text-2xl font-semibold px-4">Top Rated</h2>
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent className="-ml-2">
                        {topRated?.tracks?.items.map((item: any, index: any) => (
                          <CarouselItem key={index} className="pl-2 basis-[45%]">
                            <MusicCard
                              id={item.track.id}
                              title={item.track.name}
                              artist={item.track.artists
                                .map((artist: any) => artist.name)
                                .join(", ")}
                              coverArt={item.track.album?.images[0]?.url || "/assets/placeholder.svg"}
                              url={item.track.external_urls.spotify}
                              type={item.album_type
                                ? item.album_type === "single"
                                  ? "Track"
                                  : "Album"
                                : item.track?.type
                                ? item.track?.type === "album"
                                  ? "Album"
                                  : "Track"
                                : "Unknown"}
                                year={ item?.release_date?.split("-")[0] ||
                                  item?.track?.album?.release_date?.split("-")[0]}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 border border-border h-8 w-8" />
                      <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 border border-border h-8 w-8" />
                    </Carousel>
                  </div>
                </div>

                <div className="">
                  <h2 className="text-2xl font-semibold px-4">Recommended</h2>
                  <div className="relative">
                    <Carousel className="w-full">
                      <CarouselContent className="-ml-2">
                        {recommended?.tracks?.items.map((item: any, index: any) => (
                          <CarouselItem key={index} className="pl-2 basis-[45%]">
                            <MusicCard
                              id={item.track.id}
                              title={item.track.name}
                              artist={item.track.artists
                                .map((artist: any) => artist.name)
                                .join(", ")}
                              coverArt={item.track.album?.images[0]?.url || "/assets/placeholder.svg"}
                              url={item.track.external_urls.spotify}
                              type={item.album_type
                                ? item.album_type === "single"
                                  ? "Track"
                                  : "Album"
                                : item.track?.type
                                ? item.track?.type === "album"
                                  ? "Album"
                                  : "Track"
                                : "Unknown"}
                              year={item?.release_date?.split("-")[0] ||
                                item?.track?.album?.release_date?.split("-")[0]}
                            />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 border border-border h-8 w-8" />
                      <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background/90 border border-border h-8 w-8" />
                    </Carousel>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToCreateAccount={handleSwitchToCreateAccount}
        // onLoginSuccess={handleLoginSuccess}
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
