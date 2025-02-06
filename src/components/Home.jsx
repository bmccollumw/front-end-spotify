import React from "react";
import SpotifyLoginButton from "./SpotifyLoginButton"; // Ensure correct path

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to My Spotify App</h1>
      <SpotifyLoginButton />
    </div>
  );
};

export default Home;
