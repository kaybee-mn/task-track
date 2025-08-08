import { Image } from "expo-image";
import { Platform, RefreshControl, ScrollView, StyleSheet } from "react-native";
import AddTask from "@/components/taskpage/AddTask";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useRef, useState } from "react";
import { Task } from "../../../shared/types/task";
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

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const user_token = useRef<string | null>(null);
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
      setRecentMood(new Date(rM).getTime());
    };
    init();
    onRefresh();
  }, []);

  useEffect(() => {
    if (recentMood) {
      const now = Date.now();
    const elapsed = now - recentMood;
    const waitTime = 3600000 * 3 - elapsed; // 3 hours in ms

      if (waitTime<=0) {
        setShowMoodChecker(true);
      } else {
        console.log("new recent mood. wait time: ", (waitTime/3600000)," hours");
        setShowMoodChecker(false);
        const timeout = setTimeout(() => {
          setShowMoodChecker(true);
        }, waitTime);
        return () => clearTimeout(timeout);
      }
    }
  }, [recentMood]);

  const onRefresh = async () => {
    setRefreshing(true);
    // const tasks = await getUserTasks();
    const tasks = await getDailyUserTasks(date);
    setTasks(tasks as Task[]);
    setRefreshing(false);
  };
  if (refreshing) {
    return <Loading />;
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <ThemedView style={styles.titleContainer}>
          <HelloWave />
          <ThemedText type="title">Welcome!</ThemedText>
        </ThemedView>
        <AddTask />
      </ThemedView>
      {showMoodChecker && <MoodChecker setRecentMood={setRecentMood} />}
      <ThemedButton
        onPress={() => showMode()}
        text={date.toLocaleDateString()}
        type="subtitle"
      />
      <ThemedView style={styles.stepContainer}>
        <DailySchedule
          sortedDailyTasks={tasks}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  stepContainer: {
    gap: 8,
    marginVertical: 24,
  },
  container: {
    flex: 1,
    width: "100%",
    padding: 48,
    marginTop: 24,
    alignItems:'center'
  },
});
