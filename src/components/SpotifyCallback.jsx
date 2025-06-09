import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthToken } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const SpotifyCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("📡 SpotifyCallback mounted");

    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    const expiresIn = parseInt(params.get("expires_in"), 10);
    console.log("🔑 Parsed access token:", token);
    console.log("⏳ Token expires in (seconds):", expiresIn);

    if (!token) {
      console.error("❌ No token found in URL hash!");
      navigate("/");
      return;
    }

    const syncUserAndRedirect = async () => {
      console.log("📤 Sending POST /api/users/sync with accessToken:", token);

      try {
        const syncRes = await fetch("http://localhost:3000/api/users/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: token }),
        });

        const result = await syncRes.json();
        if (!syncRes.ok || !result.user || !result.user.id || !result.user.spotify_id) {
          throw new Error(result.message || "User sync failed.");
        }

        // ✅ Store full info including spotifyId
        dispatch(setAuthToken({
          token,
          expiresIn,
          userId: result.user.id,                  // DB id
          spotifyId: result.user.spotify_id,       // Spotify ID
          user: {
            displayName: result.user.display_name,
            email: result.user.email,
          },
        }));

        navigate("/profile");
      } catch (error) {
        console.error("❌ Error syncing user:", error.message);
        navigate("/");
      }
    };

    syncUserAndRedirect();
  }, [dispatch, navigate]);

  return <p className="p-4">Processing Spotify login...</p>;
};

export default SpotifyCallback;
