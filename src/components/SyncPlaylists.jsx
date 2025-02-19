import { useState } from "react";
import { useSelector } from "react-redux";
import { syncPlaylistsToBackend } from "../api";

const SyncPlaylists = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const syncPlaylists = async () => {
    if (!accessToken) {
      setError("No access token found. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const success = await syncPlaylistsToBackend(accessToken);

    if (success) {
      setSuccess("Playlists successfully synced!");
    } else {
      setError("Failed to sync playlists.");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Sync My Playlists</h2>
      <button onClick={syncPlaylists} className="bg-blue-500 text-white px-4 py-2 rounded">
        Sync Playlists
      </button>

      {loading && <p>Syncing...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
    </div>
  );
};

export default SyncPlaylists;
