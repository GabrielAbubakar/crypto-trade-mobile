import { secureStorageEngine } from "@/core/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createTransform, persistReducer, persistStore } from "redux-persist";
import { baseApi } from "@/core/api/baseApi";
import { authReducer } from "@/features/auth";
import { kycReducer } from "@/features/kyc";
import tempReducer from "./tempSlice";

// Transform to exclude the large/non-sensitive 'user' object from SecureStore.
// This keeps the persisted payload tiny (~300 bytes) and avoids the Android SecureStore 2KB size limit.
const authTransform = createTransform(
  // transform state on its way to being serialized and persisted.
  (inboundState: any) => {
    return {
      ...inboundState,
      user: null, // exclude user profile details from secure storage
    };
  },
  // transform state being rehydrated
  (outboundState) => {
    return outboundState;
  },
  { whitelist: ["auth"] },
);

// Custom storage engine to route "auth" to SecureStore and other keys to AsyncStorage
const dualStorageEngine = {
  setItem: async (key: string, value: string) => {
    try {
      const state = JSON.parse(value);
      const { auth, ...rest } = state;

      const promises: Promise<any>[] = [];
      if (auth !== undefined) {
        promises.push(secureStorageEngine.setItem("persist:auth", auth));
      }
      promises.push(
        AsyncStorage.setItem(
          "persist:root_non_sensitive",
          JSON.stringify(rest),
        ),
      );

      await Promise.all(promises);
      return true;
    } catch (error) {
      // console.error("[DualStorage] setItem failed:", error);
      return false;
    }
  },
  getItem: async (key: string) => {
    try {
      const [authVal, restVal] = await Promise.all([
        secureStorageEngine.getItem("persist:auth"),
        AsyncStorage.getItem("persist:root_non_sensitive"),
      ]);

      const state: Record<string, any> = {};
      if (authVal) {
        state.auth = authVal;
      }
      if (restVal) {
        const rest = JSON.parse(restVal);
        Object.assign(state, rest);
      }
      return JSON.stringify(state);
    } catch (error) {
      // console.error("[DualStorage] getItem failed:", error);
      return null;
    }
  },
  removeItem: async (key: string) => {
    try {
      await Promise.all([
        secureStorageEngine.removeItem("persist:auth"),
        AsyncStorage.removeItem("persist:root_non_sensitive"),
      ]);
      return true;
    } catch (error) {
      // console.error("[DualStorage] removeItem failed:", error);
      return false;
    }
  },
};

const persistConfig = {
  key: "root",
  storage: dualStorageEngine,
  whitelist: ["auth", "kyc"],
  transforms: [authTransform],
};

const appReducer = combineReducers({
  auth: authReducer,
  kyc: kycReducer,
  temp: tempReducer,
  [baseApi.reducerPath]: baseApi.reducer,
});

// Reset state on logout
const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any,
) => {
  if (action.type === "auth/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

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

export * from "./tempSlice";


