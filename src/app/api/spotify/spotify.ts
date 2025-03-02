// src/app/api/spotify.ts
const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET!;
const API_BASE_URL = "https://api.spotify.com/v1";

let accessToken = "";

// Function to get an access token
const getAccessToken = async () => {
  if (accessToken) return accessToken;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  // Check if the response is ok
  if (!res.ok) {
    const errorData = await res.json(); // Get the error response
    console.error("Error fetching access token:", errorData); // Log the error
    throw new Error(`Spotify API Error: ${errorData.error} - ${errorData.error_description}`);
  }

  const data = await res.json();
  accessToken = data.access_token;
  return accessToken;
};

// Function to fetch data from Spotify API
const fetchSpotifyData = async (endpoint: string) => {
  const token = await getAccessToken();

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error(`Spotify API Error: ${res.status}`);
  return res.json();
};

// Fetch Trending (Currently Top 50 Global)
export const fetchTrending = () => fetchSpotifyData("/playlists/57EG9lWmdn7HHofXuQVsow");

// Fetch New Releases
export const fetchNewReleases = () => fetchSpotifyData("/browse/new-releases");

// Fetch Top Rated (Based on popular albums)
export const fetchTopRated = () => fetchSpotifyData("/playlists/5ABHKGoOzxkaa28ttQV9sE");

// Fetch Recommended (Based on genre or category)
export const fetchRecommended = () => fetchSpotifyData("/playlists/26PbhSJhJmhexyk33DVQNk");
