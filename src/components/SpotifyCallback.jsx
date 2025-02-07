import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuthToken } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const SpotifyCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const accessToken = useSelector((state) => state.auth.accessToken);

  useEffect(() => {
    console.log("🔄 Checking URL for token...");

    const hash = window.location.hash.substring(1).split("&").reduce((acc, item) => {
      let parts = item.split("=");
      acc[parts[0]] = decodeURIComponent(parts[1]);
      return acc;
    }, {});

    console.log("🎵 Extracted Token:", hash.access_token);

    if (hash.access_token) {
      const expiresIn = parseInt(hash.expires_in) || 3600; // Default: 1 hour
      console.log("✅ Dispatching Token to Redux");
      dispatch(setAuthToken({ token: hash.access_token, expiresIn }));

      console.log("🔍 Redux State After Dispatch:", accessToken); // Check Redux state
      window.history.pushState("", document.title, "/");
      navigate("/profile");
    } else {
      console.error("❌ No access token found!");
    }
  }, [dispatch, navigate]);

  return <p>Processing Spotify login...</p>;
};

export default SpotifyCallback;
