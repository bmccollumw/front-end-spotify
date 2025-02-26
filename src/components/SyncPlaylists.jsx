import { useState } from "react";
import { useSelector } from "react-redux";
import { syncPlaylistsToBackend } from "../api/backend"; 

const SyncPlaylists = ({ playlists }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userId = useSelector((state) => state.auth.userId); // ✅ Get user ID from Redux
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const syncPlaylists = async () => {
    if (!accessToken || !userId) {
      setError("Missing access token or user ID.");
      return;
    }

    if (playlists.length === 0) {
      setError("No playlists to sync.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    console.log("🛰️ Sending Sync Request to Backend...", playlists);
    const success = await syncPlaylistsToBackend(accessToken, userId, playlists);

    if (success) {
      setSuccess("✅ Playlists successfully synced!");
    } else {
      setError("❌ Failed to sync playlists.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Sync My Playlists</h2>
      <button onClick={syncPlaylists} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
        Sync Playlists
      </button>

      {loading && <p>Syncing...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
};

export default SyncPlaylists;
