import { secureStorageEngine } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore
} from "redux-persist";
import { baseApi } from "./api";
import authReducer from "./slices/authSlice";
import kycReducer from "./slices/kycSlice";
import tempReducer from "./slices/tempSlice";

// Config for non-sensitive data
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["auth", "temp"], // Prevent auth and temp from being stored in AsyncStorage
};

// Config for sensitive data
const authPersistConfig = {
  key: 'auth',
  storage: secureStorageEngine,
};

// Combine reducers
const appReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  kyc: kycReducer,
  temp: tempReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Reset state on logout
const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

// Root reducer with both configurations
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure and create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(baseApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
