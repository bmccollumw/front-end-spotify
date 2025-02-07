import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // ✅ Use localStorage
import authReducer from "../features/auth/authSlice";

const persistConfig = {
  key: "auth", // ✅ Use "auth" instead of "root" to persist only auth state
  storage,
  whitelist: ["accessToken", "isAuthenticated", "expiresAt"], // ✅ Ensure these values are stored
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ Ignore serialization errors
    }),
});

export const persistor = persistStore(store);
