import { Image } from "expo-image";
import { Platform, RefreshControl, ScrollView, StyleSheet } from "react-native";
import AddTask from "@/components/taskpage/AddTask";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useContext, useEffect, useRef, useState } from "react";
import { SortedTask, Task } from "../../../shared/types/task";
import { supabase } from "../../api/supabaseClient";
import DailySchedule from "../../components/taskpage/DailySchedule";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDailyUserTasks, getUserTasks } from "@/api/taskService";
import Loading from "@/components/Loading";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ThemedButton } from "@/components/ThemedButton";
import MoodChecker from "@/components/taskpage/MoodChecker";
import { getMostRecentMood } from "@/api/logService";
import { TaskContext } from "@/contexts/TaskContext";

export default function HomeScreen() {
  const { tasks, setTasks } = useContext(TaskContext);
  const [refreshing, setRefreshing] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [recentMood, setRecentMood] = useState<number>();
  const [showMoodChecker, setShowMoodChecker] = useState<boolean>(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const date = selectedDate || new Date();
    setDate(date);
  };

  const showMode = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: "date",
      is24Hour: true,
    });
  };

  useEffect(() => {
    const init = async () => {
      const rM = await getMostRecentMood();
      if (rM) setRecentMood(new Date(rM).getTime());
      else {
        console.log("no recent mood");
        setShowMoodChecker(true);
      }
    };
    init();
    onRefresh();
  }, []);

  useEffect(() => {
    onRefresh();
  }, [date]);

  useEffect(() => {
    if (recentMood) {
      const now = Date.now();
      const elapsed = now - recentMood;
      const waitTime = 3600000 * 3 - elapsed; // 3 hours in ms

      if (waitTime <= 0) {
        setShowMoodChecker(true);
      } else {
        console.log(
          "new recent mood. wait time: ",
          waitTime / 3600000,
          " hours"
        );
        setShowMoodChecker(false);
        const timeout = setTimeout(() => {
          setShowMoodChecker(true);
        }, waitTime);
        return () => clearTimeout(timeout);
      }
    }
  }, [recentMood]);

  const toggleTaskCompletion = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );
      // move completed task to bottom
      return updated.sort((a, b) => {
        if (a.completed === b.completed) return a.index - b.index;
        return a.completed ? 1 : -1;
      });
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // const tasks = await getUserTasks();
    const tasks = await getDailyUserTasks(date);
    setTasks(tasks as SortedTask[]);
    setRefreshing(false);
  };
  if (refreshing) {
    return <Loading />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          <HelloWave />
          Welcome!
        </ThemedText>
        <AddTask />
      </ThemedView>
      {showMoodChecker && <MoodChecker setRecentMood={setRecentMood} />}
      <ThemedButton
        onPress={() => showMode()}
        text={date.toLocaleDateString()}
        type="subtitle"
      />
      <ThemedView style={{ flex: 4 }}>
        <DailySchedule
          sortedDailyTasks={tasks}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          onCompleteTask={toggleTaskCompletion}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 48,
    marginTop: 24,
    alignItems: "center",
    flexDirection: "column",
    gap: 16,
  },
});
