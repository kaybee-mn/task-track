import {
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import TaskBlock from "./TaskBlock";
import { ThemedView } from "../ThemedView";
import { SortedTask, Task } from "../../../shared/types/task";

export default function DailySchedule({
  sortedDailyTasks,
  refreshControl,
  onCompleteTask
}: {
  sortedDailyTasks: SortedTask[];
  refreshControl?:any;
  onCompleteTask:(taskId:string)=>void
}) {
  console.log("sortedDailyTasks", sortedDailyTasks);
  return (
    <ThemedView style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={sortedDailyTasks}
        renderItem={({ item }) => <TaskBlock task={item} onCheck={()=>{onCompleteTask(item.id)}}/>}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={refreshControl||undefined}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    width: '100%',
  },
  list: {
    width: Dimensions.get("window").width * 0.95,
    marginHorizontal: Dimensions.get("window").width * 0.02,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
