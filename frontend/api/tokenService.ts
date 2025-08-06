// tokenService.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

let cachedToken: string | null = null;

export const getToken = async (): Promise<string | null> => {
  if (cachedToken) return cachedToken;

  const storedSession = await AsyncStorage.getItem("session");
  const session = storedSession ? JSON.parse(storedSession) : null;

  if (session?.access_token) {
    cachedToken = session.access_token;
    return cachedToken;
  }

  return null;
};

export const clearCachedToken = () => {
  cachedToken = null;
};
