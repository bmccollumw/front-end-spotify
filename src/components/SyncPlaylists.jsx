import { useState } from "react";

const SyncPlaylists = ({ userId, accessToken }) => {
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);

  const handleSync = async () => {
    setSyncing(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, accessToken }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Sync failed.");
      }

      alert("✅ Sync complete! Please refresh to see new playlists.");
    } catch (err) {
      console.error("❌ Sync error:", err.message);
      setError("Sync error: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={handleSync}
        disabled={syncing}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {syncing ? "Syncing..." : "Sync My Library"}
      </button>
      {error && <p className="text-red-500 mt-2">❌ {error}</p>}
    </div>
  );
};

export default SyncPlaylists;
