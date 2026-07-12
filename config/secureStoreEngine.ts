import * as SecureStore from 'expo-secure-store';

export const secureStorageEngine = {
    setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
        return true;
    },
    getItem: async (key: string) => {
        const value = await SecureStore.getItemAsync(key);
        return value;
    },
    removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key);
        return true;
    },
};

