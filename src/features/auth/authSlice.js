import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  userId: null,      // internal DB ID
  spotifyId: null,   // Spotify account ID
  user: null,        // optional display info (name, email, image, etc)
  isAuthenticated: false,
  expiresAt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      console.log("✅ Storing in Redux → Token:", action.payload.token, "UserID:", action.payload.userId, "SpotifyID:", action.payload.spotifyId);

      state.accessToken = action.payload.token;
      state.userId = action.payload.userId;           // internal DB id
      state.spotifyId = action.payload.spotifyId;     // Spotify ID
      state.user = action.payload.user || null;       // name, email, etc.
      state.isAuthenticated = true;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
    },
    logout: (state) => {
      console.log("👋 Logging out...");
      state.accessToken = null;
      state.userId = null;
      state.spotifyId = null;
      state.user = null;
      state.isAuthenticated = false;
      state.expiresAt = null;
    },
  },
});

export const { setAuthToken, logout } = authSlice.actions;
export default authSlice.reducer;
