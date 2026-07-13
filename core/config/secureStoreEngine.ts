import * as SecureStore from "expo-secure-store";

const sanitizeKey = (key: string): string => {
  return key.replace(/[^a-zA-Z0-9.\-_]/g, "_");
};

export const secureStorageEngine = {
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(sanitizeKey(key), value);
    return true;
  },
  getItem: async (key: string) => {
    const value = await SecureStore.getItemAsync(sanitizeKey(key));
    return value;
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(sanitizeKey(key));
    return true;
  },
};
