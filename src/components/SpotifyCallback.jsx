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
      console.error("❌ No token found in URL!");
      navigate("/");
      return;
    }

    console.log("🎵 Extracted Token:", token);

    // ✅ Fetch user profile to get the user ID
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(userData => {
        if (!userData.id) {
          console.error("❌ No user ID received from Spotify API!");
          navigate("/");
          return;
        }

        console.log("🎵 User Data:", userData);
        console.log("✅ Storing in Redux → Token:", token, "UserID:", userData.id);

        // ✅ Save userId in Redux
        dispatch(setAuthToken({ token, expiresIn, userId: userData.id }));
        
        navigate("/profile");
      })
      .catch(err => {
        console.error("❌ Error fetching user profile:", err);
        navigate("/");
      });
  }, [dispatch, navigate]);

  return <p>Processing login...</p>;
};

export default SpotifyCallback;
