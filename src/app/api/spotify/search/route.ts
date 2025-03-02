import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

const getSpotifyToken = async () => {
  const cachedToken = await redis.get("spotify_token");
  if (cachedToken) return cachedToken;

  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" } }
  );
  await redis.setex("spotify_token", data.expires_in - 60, data.access_token);
  return data.access_token;
};

const fetchPaginatedResults = async (
  token: string,
  query: string,
  type: "album" | "track",
  limit: number,
  maxItems: number
) => {
  const results: any[] = [];
  let offset = 0;
  const maxPerPage = Math.min(limit, 50);

  while (results.length < maxItems) {
    const response = await axios.get("https://api.spotify.com/v1/search", {
      params: { q: query, type, limit: maxPerPage, offset },
      headers: { Authorization: `Bearer ${token}` },
    });

    const items = type === "album" ? response.data.albums.items : response.data.tracks.items;
    results.push(...items.map((item: any) => ({ ...item, type })));

    const total = type === "album" ? response.data.albums.total : response.data.tracks.total;
    offset += maxPerPage;

    if (offset >= total || results.length >= maxItems) break;
  }

  return results;
};

export async function POST(req: NextRequest) {
  const { dateRange, genre, artist } = await req.json();

  // Remove the strict dateRange requirement
  if (!dateRange && !genre && !artist) {
    return NextResponse.json({ error: "At least one filter (date, genre, or artist) is required" }, { status: 400 });
  }

  const token = await getSpotifyToken();
  let query = "";
  if (dateRange?.from) query += ` year:${dateRange.from.split("-")[0]}`;
  if (dateRange?.to) query += `-${dateRange.to.split("-")[0]}`;
  if (genre) query += ` genre:${genre}`;
  if (artist) query += ` artist:${artist}`;

  const cacheKey = `search:${query}`;
  const cached = await redis.get(cacheKey);
  if (cached) return NextResponse.json(JSON.parse(cached));

  const maxItems = 200;
  const limitPerRequest = 50;

  const [albums, tracks] = await Promise.all([
    fetchPaginatedResults(token, query.trim(), "album", limitPerRequest, maxItems),
    fetchPaginatedResults(token, query.trim(), "track", limitPerRequest, maxItems),
  ]);

  const releases = [...albums, ...tracks].sort(
    (a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
  );

  const cappedReleases = releases.slice(0, maxItems);

  await redis.setex(cacheKey, 3600, JSON.stringify({ releases: cappedReleases }));
  return NextResponse.json({ releases: cappedReleases });
}