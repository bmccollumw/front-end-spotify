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

  // Redirect if not authenticated
  useEffect(() => {
    if (!accessToken) return navigate("/");
  }, [accessToken, navigate]);

  // Get user profile data from the backend (already stored)
  useEffect(() => {
    const fetchSyncedUser = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/user/${userId}`);
        if (!res.ok) throw new Error("User not found");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("❌ Error loading user:", err);
        dispatch(logout());
        navigate("/");
      }
    };

    if (userId) fetchSyncedUser();
  }, [userId, dispatch, navigate]);

  // Get synced playlists from the backend
  useEffect(() => {
    const fetchSyncedPlaylists = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/playlists/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch synced playlists.");
        const data = await res.json();
        setPlaylists(data);
      } catch (err) {
        console.error("❌ Error fetching playlists:", err);
      }
    };

    if (userId) fetchSyncedPlaylists();
  }, [userId]);

  return (
    <div className="p-6">
      {user && (
        <>
          <h1 className="text-2xl font-bold">Welcome, {user.display_name}!</h1>
          <p>Email: {user.email}</p>

          <SyncPlaylists userId={userId} accessToken={accessToken} />

          <div className="mt-4">
            <p>You have {playlists.length} playlists synced.</p>
            <ul className="list-disc pl-6">
              {playlists.map((pl) => (
                <li key={pl.id}>
                  {pl.name} ({pl.total_tracks} songs)
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => dispatch(logout())}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
