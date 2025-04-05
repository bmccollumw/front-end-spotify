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

  useEffect(() => {
    if (!accessToken) return;

    const fetchPlaylists = async () => {
      let allPlaylists = [];
      let next = "https://api.spotify.com/v1/me/playlists?limit=50";

      while (next) {
        const res = await fetch(next, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await res.json();
        allPlaylists = [...allPlaylists, ...data.items];
        next = data.next;
      }

      setPlaylists(allPlaylists);
    };

    fetchPlaylists();
  }, [accessToken]);

  return (
    <div className="p-6">
      {user && (
        <>
          <h1 className="text-2xl font-bold">Welcome, {user.display_name}!</h1>
          <p>Email: {user.email}</p>

          <SyncPlaylists playlists={playlists} />

          <div className="mt-4">
            <p>You have {playlists.length} playlists ready to sync.</p>
            <ul className="list-disc pl-6">
              {playlists.map((pl) => (
                <li key={pl.id}>
                  {pl.name} ({pl.tracks.total} songs)
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
