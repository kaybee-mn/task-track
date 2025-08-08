import { router } from "expo-router";
import { Task } from "../../shared/types/task";
import { getToken } from "./tokenService";
import { ROUTES } from "@/constants/routes";

const getUserTasks = async () => {
  const token = await getToken();
  if (!token) {
    console.warn("No token found.");
    return;
  }

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const taskData = await response.json();
  if (taskData && Array.isArray(taskData)) {
    return taskData
  }
};

const getDailyUserTasks = async (date:Date) => {
  const token = await getToken();
  if (!token) {
    console.warn("No token found.");
    return;
  }

  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tasks/${date}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  });
  const taskData = await response.json();
  if (taskData && Array.isArray(taskData)) {
    return taskData
  }
};

const createTask = async ({
  data,
  setRefreshing,
}: {
  data: Task;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  setRefreshing(true);
  const token = await getToken();
  if (!token) {
    console.warn("No token found.");
    return;
  }
  const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ...data }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Failed to create task:", errorText);
  }

  setRefreshing(false);
  router.push(ROUTES.HOME);
};
export { getUserTasks, createTask, getDailyUserTasks };
