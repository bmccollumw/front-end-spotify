import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  userId: null, // ✅ Add userId to Redux state
  isAuthenticated: false,
  expiresAt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      console.log("✅ Storing in Redux → Token:", action.payload.token, "UserID:", action.payload.userId);
      state.accessToken = action.payload.token;
      state.userId = action.payload.userId; // ✅ Store user ID
      state.isAuthenticated = true;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
    },
    logout: (state) => {
      console.log("👋 Logging out...");
      state.accessToken = null;
      state.userId = null; // ✅ Clear user ID on logout
      state.isAuthenticated = false;
      state.expiresAt = null;
    },
  },
});

export const { setAuthToken, logout } = authSlice.actions;
export default authSlice.reducer;
