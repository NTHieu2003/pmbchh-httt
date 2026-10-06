import AsyncStorage from '@react-native-async-storage/async-storage';

export const setToLS = async (key: string, value: unknown): Promise<void> => {
  if (value === undefined) return;

  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn('[LS] set failed', key, error);
  }
};

export const getFromLS = async <T = unknown>(
  key: string
): Promise<T | null | undefined> => {
  try {
    const value = await AsyncStorage.getItem(key);

    if (value === null) return undefined;

    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  } catch (error) {
    console.warn('[LS] get failed', key, error);
    return undefined;
  }
};

export const removeFromLS = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn('[LS] remove failed', key, error);
  }
};
