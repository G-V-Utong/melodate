import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL!);

const getSpotifyToken = async () => {
  const cachedToken = await redis.get("spotify_token");
  if (cachedToken) return cachedToken;

  const auth = Buffer.from(
    `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");
  const { data } = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/x-www-form-urlencoded" } }
  );
  await redis.setex("spotify_token", data.expires_in - 60, data.access_token);
  return data.access_token;
};

export async function POST(req: NextRequest) {
  const { date, genre, artist, label } = await req.json();
  if (!date) return NextResponse.json({ error: "Date is required" }, { status: 400 });

  const token = await getSpotifyToken();
  let query = `year:${date.split("-")[0]}`; // Spotify uses year for albums
  if (genre) query += ` genre:${genre}`;
  if (artist) query += ` artist:${artist}`;
  if (label) query += ` label:${label}`;

  const cacheKey = `search:${query}`;
  const cached = await redis.get(cacheKey);
  if (cached) return NextResponse.json(JSON.parse(cached));

  const [albumsRes, tracksRes] = await Promise.all([
    axios.get("https://api.spotify.com/v1/search", {
      params: { q: query, type: "album", limit: 50 },
      headers: { Authorization: `Bearer ${token}` },
    }),
    axios.get("https://api.spotify.com/v1/search", {
      params: { q: query, type: "track", limit: 50 },
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  const releases = [
    ...albumsRes.data.albums.items.map((item: any) => ({ ...item, type: "album" })),
    ...tracksRes.data.tracks.items.map((item: any) => ({ ...item, type: "track" })),
  ].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());

  await redis.setex(cacheKey, 3600, JSON.stringify({ releases }));
  return NextResponse.json({ releases });
}