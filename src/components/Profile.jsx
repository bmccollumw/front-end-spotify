import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      console.error("❌ No access token found! Redirecting...");
      navigate("/");
      return;
    }

    console.log("🛠 Fetching user profile...");
    
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` }
    })
      .then(res => res.json())
      .then(data => {
        console.log("🎵 User Data:", data);
        setUser(data);
      })
      .catch(err => {
        console.error("❌ Error fetching user:", err);
        dispatch(logout()); 
        navigate("/");
      });
  }, [accessToken, dispatch, navigate]);

  const fetchPlaylists = async () => {
    if (!accessToken) {
      setError("No access token found. Please log in.");
      return;
    }

    setLoading(true);
    setError(null);
    let allPlaylists = [];
    let nextUrl = "https://api.spotify.com/v1/me/playlists?limit=50";

    try {
      while (nextUrl) {
        const response = await fetch(nextUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          throw new Error(`Spotify API error: ${response.status}`);
        }

        const data = await response.json();
        allPlaylists = [...allPlaylists, ...data.items];
        nextUrl = data.next; // Spotify API provides `next` if there are more playlists

        console.log("🎵 Fetched batch of playlists:", data.items);
      }

      console.log("✅ All Playlists Fetched:", allPlaylists);
      setPlaylists(allPlaylists); // Store all playlists in state

    } catch (err) {
      console.error("❌ Error fetching playlists:", err);
      setError("Failed to fetch playlists.");
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
            onClick={fetchPlaylists}
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 hover:bg-blue-600"
          >
            Show My Playlists
          </button>

          {loading && <p>Loading playlists...</p>}
          {error && <p className="text-red-500">{error}</p>}

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
