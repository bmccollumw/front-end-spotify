import { useState } from "react";
import { useSelector } from "react-redux";

const SyncPlaylists = ({ playlists }) => {
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

    if (!playlists || playlists.length === 0) {
      setError("No playlists to sync.");
      return;
    }

    const payload = {
      userId,
      playlists,
      accessToken,
    };

    console.log("📡 Sending this data to /api/sync:", payload);

    try {
      setLoading(true);

      const res = await fetch("http://localhost:3000/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to sync.");
        } else {
          throw new Error("Non-JSON error response received from backend.");
        }
      }

      const data = await res.json();
      console.log("✅ Sync Success:", data.message);
      setSuccess(data.message || "Successfully synced playlists!");
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
      >
        Sync My Library
      </button>

      {loading && <p className="text-blue-500 mt-2">Syncing with backend...</p>}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">{success}</p>}
    </div>
  );
};

export default SyncPlaylists;
