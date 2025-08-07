import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";
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
import { getUserTasks } from "@/api/taskService";
import Loading from "@/components/Loading";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ThemedButton } from "@/components/ThemedButton";

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const user_token = useRef<string | null>(null);
  const [date, setDate] = useState<Date>(new Date());

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
    onRefresh();
  }, []);

  const onRefresh = async () => {
    getUserTasks({ setTasks, setRefreshing });
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
      <ThemedView style={styles.stepContainer}>
        <ThemedButton
          onPress={() => showMode()}
          text={date.toLocaleDateString()}
          type="subtitle"
        />
        <DailySchedule sortedDailyTasks={tasks} />
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
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 48,
    marginTop:24
  },
});
