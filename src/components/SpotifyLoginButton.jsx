import React from "react";

// Your actual Spotify app client ID
const CLIENT_ID = "6ef0bebd686c4b2cb6c28a191cc0c3b4";

// This must exactly match the one you registered on the Spotify Developer Dashboard
const REDIRECT_URI = "http://localhost:5173/callback";

// List of permissions your app is requesting
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "user-library-read"
].join(" "); // Spaces, not %20, for encodeURIComponent to handle

// Construct the correct Spotify authorization URL
const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

const SpotifyLoginButton = () => {
  const handleLogin = () => {
    console.log("🎵 Redirecting to:", SPOTIFY_AUTH_URL);
    window.location.href = SPOTIFY_AUTH_URL;
  };

  return (
    <button
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50"
      onClick={handleLogin}
    >
      Login with Spotify
    </button>
  );
};

export default SpotifyLoginButton;
