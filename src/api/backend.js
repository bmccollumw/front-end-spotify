export async function syncPlaylistsToBackend(accessToken, userId, playlists) {
  try {
    console.log("📡 Sending Playlists to Backend:", playlists, "👤 User ID:", userId);

    const response = await fetch("http://localhost:3000/api/sync", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ accessToken, userId, playlists }), // ✅ Send userId and playlists
    });

    const data = await response.json();
    console.log("✅ Backend Sync Response:", data); // Debugging Response
    return response.ok;
  } catch (error) {
    console.error("❌ Sync error:", error);
    return false;
  }
}
