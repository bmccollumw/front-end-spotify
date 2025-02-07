import React from "react";

const CLIENT_ID = "6ef0bebd686c4b2cb6c28a191cc0c3b4";
const REDIRECT_URI = "http://localhost:5173/callback";
const SCOPES = ["user-read-private", "user-read-email", "playlist-read-private"].join("%20"); // ✅ Ensure correct encoding

const SPOTIFY_AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${SCOPES}`;

console.log("🔍 Spotify OAuth URL:", SPOTIFY_AUTH_URL); // ✅ Debugging

const SpotifyLoginButton = () => {
  return (
    <button
      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      onClick={() => {
        console.log("🎵 Redirecting to:", SPOTIFY_AUTH_URL);
        window.location.href = SPOTIFY_AUTH_URL; // ✅ Proper redirect
      }}
    >
      Login with Spotify
    </button>
  );
};

export default SpotifyLoginButton;
