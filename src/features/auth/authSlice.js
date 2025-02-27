import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
  userId: null, // ✅ Ensure userId is tracked
  isAuthenticated: false,
  expiresAt: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action) => {
      console.log("✅ Storing Token in Redux:", action.payload.token);
      state.accessToken = action.payload.token;
      state.userId = action.payload.userId; // ✅ Store userId
      state.isAuthenticated = true;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
    },
    logout: (state) => {
      console.log("👋 Logging out...");
      state.accessToken = null;
      state.userId = null; // ✅ Clear userId on logout
      state.isAuthenticated = false;
      state.expiresAt = null;
    },
  },
});

export const { setAuthToken, logout } = authSlice.actions;
export default authSlice.reducer;
