import { router } from "expo-router";
import { Task } from "../../shared/types/task";
import { getToken } from "./tokenService";
import { ROUTES } from "@/constants/routes";

const getUserTasks = async ({
  setTasks,
  setRefreshing,
}: {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  setRefreshing: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  setRefreshing(true);
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
  const  taskData  = await response.json();
  setTimeout(() => {
    // Update your data here
    if (taskData && Array.isArray(taskData)) {
      setTasks(taskData);
    }
    setRefreshing(false);
  }, 500); // Simulate a 2-second delay
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

  setTimeout(() => {
    setRefreshing(false);
    router.replace(ROUTES.HOME)
  }, 500);
};
export { getUserTasks,createTask };
