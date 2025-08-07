import { getToken } from "./tokenService";
import {Log}  from '../../shared/types/logs'

const getMostRecentMood = async () => {
  const token = await getToken();
  if (!token) {
    console.warn("No token found.");
    return;
  }
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_API_URL}/logs/recentMood`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const moodData = await response.json();
  return moodData.id;
};

const getUserLogs = async ({
  setLogs,
  setRefreshing,
}: {
  setLogs: React.Dispatch<React.SetStateAction<Log[]>>;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  setRefreshing(true);
  const token = await getToken();
  if (!token) {
    console.warn("No token found.");
    return;
  }

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/logs`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const logData = await response.json();
  if (logData && Array.isArray(logData)) {
    setLogs(logData);
  }
  setRefreshing(false);
};

export {getMostRecentMood,getUserLogs}
