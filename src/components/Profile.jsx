import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.userId);

  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [syncSuccess, setSyncSuccess] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      console.error("❌ No access token found! Redirecting...");
      navigate("/");
      return;
    }

    console.log("🛠 Fetching user profile...");

    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("🎵 User Data:", data);
        setUser(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching user:", err);
        dispatch(logout());
        navigate("/");
      });
  }, [accessToken, dispatch, navigate]);

  const fetchAndSyncPlaylists = async () => {
    if (!accessToken) {
      setError("No access token found. Please log in.");
      return;
    }
  
    if (!userId) {
      console.error("❌ No User ID found in Redux!");
      setError("User ID missing! Try logging out and back in.");
      return;
    }
  
    setLoading(true);
    setError(null);
    setSyncSuccess(false);
    let allPlaylists = [];
    let nextUrl = "https://api.spotify.com/v1/me/playlists?limit=50";
  
    try {
      // 1️⃣ Fetch all playlists from Spotify
      while (nextUrl) {
        const response = await fetch(nextUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        if (!response.ok) {
          throw new Error(`Spotify API error: ${response.status}`);
        }
  
        const data = await response.json();
        allPlaylists = [...allPlaylists, ...data.items];
        nextUrl = data.next;
      }
  
      setPlaylists(allPlaylists); // Store in state
  
      console.log("✅ All Playlists Fetched:", allPlaylists);
      console.log("👤 User ID from Redux:", userId);
  
      // 2️⃣ Sync playlists to the backend
      console.log("📡 Sending Data to Backend...");
      const syncResponse = await fetch("http://localhost:3000/api/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessToken, userId, playlists: allPlaylists }), // ✅ Corrected variable name
      });
  
      const responseData = await syncResponse.json();
      console.log("✅ Backend Sync Response:", responseData);
  
      if (!syncResponse.ok) {
        throw new Error(`Backend sync failed: ${responseData.error || "Unknown error"}`);
      }
  
      setSyncSuccess(true); // Show success message
    } catch (err) {
      console.error("❌ Error fetching or syncing playlists:", err);
      setError("Failed to fetch or sync playlists.");
    }
  
    setLoading(false);
  };
  

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {user ? (
        <>
          <h2 className="text-2xl font-bold mb-2">Welcome, {user.display_name}!</h2>
          <p>Email: {user.email}</p>

          <button
            onClick={fetchAndSyncPlaylists}
            className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
          >
            Fetch & Sync Playlists
          </button>

          {loading && <p>Loading playlists...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {syncSuccess && <p className="text-green-500">✅ Playlists successfully synced!</p>}

          <ul className="mt-4">
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <li key={playlist.id} className="p-2 border-b border-gray-200">
                  {playlist.name}
                </li>
              ))
            ) : (
              <p>No playlists found.</p>
            )}
          </ul>

          <button
            onClick={() => dispatch(logout())}
            className="bg-red-500 text-white px-4 py-2 rounded mt-4 hover:bg-red-600"
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
