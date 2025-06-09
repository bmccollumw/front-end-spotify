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
  const spotifyId = useSelector((state) => state.auth.spotifyId); // ✅ this was missing
  const user = useSelector((state) => state.auth.user);

  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistSongs, setPlaylistSongs] = useState([]);
  const [justSynced, setJustSynced] = useState(false); // ✅ trigger re-fetch

  useEffect(() => {
    if (!accessToken || !userId || !user) {
      navigate("/");
    }
  }, [accessToken, userId, user, navigate]);

  // 🔁 Fetch playlists from backend
  const fetchPlaylists = async () => {
    console.log("🔁 Calling fetchPlaylists");
    try {
      const res = await fetch(`http://localhost:3000/api/playlists/${userId}`, {
        cache: "no-store", // force fresh fetch
      });
      const data = await res.json();
      console.log("🎧 Updated playlists from DB:", data);
      setPlaylists(data);
    } catch (err) {
      console.error("❌ Error fetching playlists:", err);
    }
  };

  // 🔁 Run when user logs in or sync is done
  useEffect(() => {
    if (userId) fetchPlaylists();
  }, [userId, justSynced]);

  // 🎵 Fetch songs for a selected playlist
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/songs/${selectedPlaylist.id}`);
        if (!res.ok) throw new Error("Failed to load playlist songs.");
        const data = await res.json();
        setPlaylistSongs(data);
      } catch (err) {
        console.error("❌ Error fetching playlist songs:", err);
      }
    };

    if (selectedPlaylist) fetchSongs();
  }, [selectedPlaylist]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full p-4 border-b md:border-b-0 md:border-r md:w-1/3 lg:w-1/4">
        {user && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">{user.displayName}</h1>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>
              <button
                onClick={() => dispatch(logout())}
                className="text-sm bg-red-500 text-white px-3 py-1 rounded"
              >
                Logout
              </button>
            </div>

            {/* Sync button */}
            <SyncPlaylists
              accessToken={accessToken}
              spotifyId={spotifyId}
              onSyncComplete={fetchPlaylists} 
            />


            {/* Playlist list */}
            <div>
              <h2 className="mt-4 text-lg font-semibold">Playlists</h2>
              <ul className="mt-2 space-y-1">
                {playlists.map((pl) => (
                  <li
                    key={pl.id}
                    className={`cursor-pointer px-2 py-1 rounded hover:bg-gray-200 ${
                      selectedPlaylist?.id === pl.id ? "bg-gray-300" : ""
                    }`}
                    onClick={() => setSelectedPlaylist(pl)}
                  >
                    {pl.name} ({pl.total_tracks})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Playlist songs view */}
      <div className="flex-1 p-4">
        {selectedPlaylist ? (
          <div>
            <h2 className="text-xl font-bold mb-2">{selectedPlaylist.name}</h2>
            <ul className="space-y-1">
              {playlistSongs.map((song, index) => (
                <li key={index} className="text-sm border-b py-1">
                  {song.name} — {song.artist}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-gray-600">Select a playlist to view its songs.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
