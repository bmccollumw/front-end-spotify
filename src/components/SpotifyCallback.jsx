import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setAuth } from "../features/auth/authSlice";

const SpotifyCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash.substring(1).split("&").reduce((acc, item) => {
      let parts = item.split("=");
      acc[parts[0]] = decodeURIComponent(parts[1]);
      return acc;
    }, {});

    if (hash.access_token) {
      dispatch(setAuth(hash.access_token)); // Store token in Redux
      window.history.pushState("", document.title, "/"); // Clean URL
      navigate("/profile"); // Redirect to profile page
    }
  }, [dispatch, navigate]);

  return <p>Logging in...</p>;
};

export default SpotifyCallback;
