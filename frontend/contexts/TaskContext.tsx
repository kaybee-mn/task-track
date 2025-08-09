import React, { createContext, useState, ReactNode } from "react";
import type { SortedTask, Task } from "../../shared/types/task";

// Define the shape of your context data
type TaskContextType = {
  tasks: SortedTask[];
  setTasks: React.Dispatch<React.SetStateAction<SortedTask[]>>;
};

// Create context with default values
export const TaskContext = createContext<TaskContextType>({
  tasks: [],
  setTasks: () => {},
});

// Provider component that wraps your app and provides the context
type Props = {
  children: ReactNode;
};

export const TaskProvider = ({ children }: Props) => {
  const [tasks, setTasks] = useState<SortedTask[]>([]);

  return (
    <TaskContext.Provider value={{ tasks, setTasks }}>
      {children}
    </TaskContext.Provider>
  );
};
