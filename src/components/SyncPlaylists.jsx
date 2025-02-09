import { useState } from "react";
import { useSelector } from "react-redux";

const SyncPlaylists = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [largestPlaylist, setLargestPlaylist] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const findLargestPlaylist = async () => {
    if (!accessToken) {
      setError("No access token found. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let allPlaylists = [];
      let nextUrl = "https://api.spotify.com/v1/me/playlists?limit=50";

      while (nextUrl) {
        const response = await fetch(nextUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          throw new Error(`Spotify API error: ${response.status}`);
        }

        const data = await response.json();
        allPlaylists = [...allPlaylists, ...data.items];
        nextUrl = data.next; // If there are more playlists, keep fetching
      }

      console.log("🎵 All Playlists:", allPlaylists);

      // Find the playlist with the most tracks
      const largest = allPlaylists.reduce((max, playlist) =>
        playlist.tracks.total > (max?.tracks.total || 0) ? playlist : max,
        null
      );

      setLargestPlaylist(largest);
      console.log("🎶 Largest Playlist:", largest);

    } catch (err) {
      console.error("❌ Error fetching playlists:", err);
      setError("Failed to find the largest playlist.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Find My Largest Playlist</h2>
      <button onClick={findLargestPlaylist} className="bg-blue-500 text-white px-4 py-2 rounded">
        Find Largest Playlist
      </button>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {largestPlaylist && (
        <div className="mt-4 p-4 border rounded">
          <h3 className="text-xl font-bold">{largestPlaylist.name}</h3>
          <p>🎵 {largestPlaylist.tracks.total} songs</p>
          <p>🔒 {largestPlaylist.public ? "Public" : "Private"}</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded mt-4">
            Extract Songs & Metadata
          </button>
        </div>
      )}
    </div>
  );
};

export default SyncPlaylists;
