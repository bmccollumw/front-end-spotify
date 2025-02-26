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

    if (token) {
      console.log("🎵 Extracted Token:", token);

      // ✅ Fetch user profile to get the user ID
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(userData => {
          console.log("🎵 User Data:", userData);
          dispatch(setAuthToken({ token, expiresIn, userId: userData.id })); // ✅ Save userId
          navigate("/profile");
        })
        .catch(err => {
          console.error("❌ Error fetching user:", err);
          navigate("/");
        });
    } else {
      console.error("❌ No token found!");
      navigate("/");
    }
  }, [dispatch, navigate]);

  return <p>Processing login...</p>;
};

export default SpotifyCallback;
