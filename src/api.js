export const syncPlaylistsToBackend = async (accessToken) => {
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
        nextUrl = data.next; // Continue fetching if more playlists exist
      }
  
      console.log("🎵 All Playlists Retrieved:", allPlaylists);
  
      // Send to backend
      const backendResponse = await fetch("http://localhost:3000/api/sync-playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ playlists: allPlaylists }),
      });
  
      if (!backendResponse.ok) {
        throw new Error(`Backend API error: ${backendResponse.status}`);
      }
  
      console.log("✅ Playlists Synced Successfully!");
      return true;
  
    } catch (error) {
      console.error("❌ Error syncing playlists:", error);
      return false;
    }
  };
  