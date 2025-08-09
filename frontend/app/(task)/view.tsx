import { router, Stack, useLocalSearchParams } from "expo-router";
import { SortedTask } from "../../../shared/types/task";
import { ThemedText } from "@/components/ThemedText";
import { useContext } from "react";
import { TaskContext } from "@/contexts/TaskContext";
import { TouchableOpacity } from "react-native";
import { ROUTES } from "@/constants/routes";

const View = () => {
  const { taskId } = useLocalSearchParams();
  const { tasks } = useContext(TaskContext);
  const task = tasks.find((t) => t.id === taskId);
  if (!task) {
    router.back();
  }
  const EditButton = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          router.push({ pathname: ROUTES.ADD, params: { taskId: task?.id } });
        }}
      >
        <ThemedText>Edit</ThemedText>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: task!.title,
          headerRight() {
            return <EditButton />;
          },
        }}
      />
    </>
  );
};
export default View;
