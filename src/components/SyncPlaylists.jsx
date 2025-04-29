import { useState } from "react";
import { useSelector } from "react-redux";

const SyncPlaylists = ({ onSyncSuccess }) => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userId = useSelector((state) => state.auth.userId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const syncPlaylists = async () => {
    setError(null);
    setSuccess(null);

    if (!accessToken || !userId) {
      setError("Missing access token or user ID.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, accessToken }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to sync.");
      }

      const data = await res.json();
      console.log("✅ Sync Success:", data.message);
      setSuccess(data.message || "Successfully synced playlists!");

      // 👉 New! Trigger re-fetch after sync success
      if (onSyncSuccess) {
        onSyncSuccess();
      }
    } catch (err) {
      console.error("❌ Sync Error:", err.message);
      setError(`❌ Sync error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={syncPlaylists}
        className="bg-green-500 text-white px-4 py-2 rounded"
        disabled={loading}
      >
        {loading ? "Syncing..." : "Sync My Library"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default SyncPlaylists;
