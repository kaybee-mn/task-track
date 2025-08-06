import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  Dimensions,
} from "react-native";
import TaskBlock from "./TaskBlock";
import { Task } from "../../../shared/types/task";
import { ThemedText } from "../ThemedText";
import ParallaxScrollView from "../ParallaxScrollView";
import { ThemedView } from "../ThemedView";

export default function DailySchedule({
  sortedDailyTasks,
}: {
  sortedDailyTasks: any[];
}) {
  console.log("sortedDailyTasks", sortedDailyTasks);
  return (
    <ThemedView style={styles.container}>
      <FlatList
        contentContainerStyle={styles.list}
        data={sortedDailyTasks}
        renderItem={({ item }) => <TaskBlock task={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",

    marginTop: StatusBar.currentHeight || 0,
    width: 300,
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
