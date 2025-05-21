import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthToken } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const SpotifyCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("access_token");
    const expiresIn = parseInt(params.get("expires_in"), 10);

    if (!token) {
      console.error("❌ No token found in URL hash!");
      navigate("/");
      return;
    }

    const fetchSpotifyProfileAndSync = async () => {
      try {
        // Step 1: Fetch user profile from Spotify
        const profileRes = await fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!profileRes.ok) throw new Error("Failed to fetch user profile.");

        const userData = await profileRes.json();
        if (!userData || !userData.id) throw new Error("No user ID in Spotify response.");

        // Step 2: Sync user with backend
        const syncRes = await fetch("http://localhost:3000/api/users/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            spotifyId: userData.id,
            displayName: userData.display_name,
            email: userData.email,
          }),
        });

        const result = await syncRes.json();
        if (!result.success || !result.userId) throw new Error("User sync failed.");

        // Step 3: Store token and navigate
        dispatch(setAuthToken({ token, expiresIn, userId: result.userId }));
        navigate("/profile");
      } catch (error) {
        console.error("❌ Error during Spotify callback:", error.message);
        navigate("/");
      }
    };

    fetchSpotifyProfileAndSync();
  }, [dispatch, navigate]);

  return <p className="p-4">Processing Spotify login...</p>;
};

export default SpotifyCallback;
