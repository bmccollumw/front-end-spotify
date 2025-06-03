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
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!accessToken) return navigate("/");
  }, [accessToken, navigate]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUser = async () => {
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
    if (userId) fetchUser();
  }, [userId, dispatch, navigate]);

  // Fetch playlists
  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/playlists/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch playlists");
        const data = await res.json();
        setPlaylists(data);
      } catch (err) {
        console.error("❌ Error fetching playlists:", err);
      }
    };
    if (userId) fetchPlaylists();
  }, [userId]);

  return (
    <div className="flex flex-col min-h-screen p-4 md:flex-row">
      {/* Left Sidebar */}
      <div className="md:w-1/3 w-full md:pr-6">
        <div className="flex justify-between items-center">
          <div>
            {user && (
              <>
                <h1 className="text-xl font-bold">{user.display_name}</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </>
            )}
          </div>
          <button
            onClick={() => dispatch(logout())}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>

        {/* Sync Button */}
        <div className="mt-4">
          <SyncPlaylists userId={userId} accessToken={accessToken} />
        </div>

        {/* Playlist List */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Your Playlists</h2>
          <ul className="space-y-2">
            {playlists.map((pl) => (
              <li
                key={pl.id}
                onClick={() => setSelectedPlaylist(pl)}
                className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                  selectedPlaylist?.id === pl.id ? "bg-blue-100 font-semibold" : ""
                }`}
              >
                {pl.name} <span className="text-sm text-gray-500">({pl.total_tracks} songs)</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Panel */}
      <div className="md:w-2/3 w-full mt-6 md:mt-0">
        {selectedPlaylist ? (
          <div>
            <h2 className="text-xl font-bold">{selectedPlaylist.name}</h2>
            <p className="text-sm text-gray-600">Total Tracks: {selectedPlaylist.total_tracks}</p>
            {/* Later: Display track list from DB here */}
          </div>
        ) : (
          <p className="text-gray-500 italic">Select a playlist to see details.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
