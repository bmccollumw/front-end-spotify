import { useState } from "react";
import { useSelector } from "react-redux";

const SyncPlaylists = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlaylists = async () => {
    if (!accessToken) {
      setError("No access token found. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("https://api.spotify.com/v1/me/playlists", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status}`);
      }

      const data = await response.json();
      console.log("🎵 Fetched Playlists:", data.items);
      setPlaylists(data.items); // Store playlists in state

    } catch (err) {
      console.error("❌ Error fetching playlists:", err);
      setError("Failed to fetch playlists.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Sync Your Playlists</h2>
      <button onClick={fetchPlaylists} className="bg-blue-500 text-white px-4 py-2 rounded">
        Sync Playlists
      </button>

      {loading && <p>Loading playlists...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>{playlist.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default SyncPlaylists;
