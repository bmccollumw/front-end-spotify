import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import SyncPlaylists from "../components/SyncPlaylists";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const userId = useSelector((state) => state.auth.userId);

  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [loadingPlaylists, setLoadingPlaylists] = useState(false);
  const [error, setError] = useState(null);

  // Fetch user profile info (just for greeting / logout)
  useEffect(() => {
    if (!accessToken) return navigate("/");

    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then(setUser)
      .catch((err) => {
        console.error("❌ Failed to fetch profile:", err);
        dispatch(logout());
        navigate("/");
      });
  }, [accessToken, dispatch, navigate]);

  // Fetch synced playlists from our backend
  const fetchSyncedPlaylists = async () => {
    if (!userId) return;

    setLoadingPlaylists(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3000/api/playlists/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch synced playlists.");

      const data = await res.json();
      setPlaylists(data.playlists || []);
    } catch (err) {
      console.error("❌ Error fetching playlists:", err);
      setError(err.message);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchSyncedPlaylists();
    }
  }, [userId]);

  return (
    <div className="p-6">
      {user && (
        <>
          <h1 className="text-2xl font-bold">Welcome, {user.display_name}!</h1>
          <p>Email: {user.email}</p>

          {/* Sync button */}
          <SyncPlaylists onSyncSuccess={fetchSyncedPlaylists} />

          {/* Display playlists after sync */}
          <div className="mt-6">
            {loadingPlaylists && <p className="text-blue-500">Loading playlists...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loadingPlaylists && playlists.length > 0 && (
              <>
                <p>You have {playlists.length} playlists synced:</p>
                <ul className="list-disc pl-6 mt-2">
                  {playlists.map((pl) => (
                    <li key={pl.id}>
                      {pl.name} ({pl.total_tracks} songs)
                    </li>
                  ))}
                </ul>
              </>
            )}

            {!loadingPlaylists && playlists.length === 0 && (
              <p className="text-gray-500">No playlists synced yet.</p>
            )}
          </div>

          {/* Logout button */}
          <button
            onClick={() => dispatch(logout())}
            className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
