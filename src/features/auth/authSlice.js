import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  accessToken: null,
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
      state.isAuthenticated = true;
      state.expiresAt = Date.now() + action.payload.expiresIn * 1000;
    },
    logout: (state) => {
      console.log("👋 Logging out...");
      state.accessToken = null;
      state.isAuthenticated = false;
      state.expiresAt = null;
    },
  },
});

export const { setAuthToken, logout } = authSlice.actions;
export default authSlice.reducer;
