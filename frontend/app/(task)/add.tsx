import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ScrollView, StyleSheet } from "react-native";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/ThemedButton";
import { useRef, useState } from "react";
import { Task, RecurrenceInfo, SortingInfo } from "../../../shared/types/task";

import RadioButton from "@/components/addtaskpage/RadioButton";
import InfoBox from "@/components/addtaskpage/InfoBox";
import ThemedSmallTextInput from "@/components/addtaskpage/ThemedSmallTextInput";
import DropdownMenu from "@/components/addtaskpage/Dropbox";
import RecurrenceBlock, {
  RecRef,
} from "@/components/addtaskpage/RecurrenceBlock";
import SortingBlock, { SortRef } from "@/components/addtaskpage/SortingBlock";
import { Collapsible } from "@/components/Collapsible";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { createTask } from "@/api/taskService";
import BackButton from "@/components/BackButton";
import { Stack } from "expo-router";

type Props = {
  task?: Task;
};

const Add = ({ task }: Props) => {
  const recRef = useRef<RecRef>(null);
  const sortRef = useRef<SortRef>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>(task?.title || "");
  const [description, setDescription] = useState<string>(
    task?.description || ""
  );
  const [duration, setDuration] = useState<string>(
    task?.duration ? String(task?.duration) : ""
  );
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
  const [recurrence, setRecurrence] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(
    task?.startDate ? new Date(task.startDate) : new Date()
  );

  const handleSubmit = () => {
    if (!title.trim()) {
      setAttemptedSubmit(true);
      return;
    }
    let data = {};
    if (!duration) {
      // api call to suggest duration based on title, desc
      setDuration("1");
    }
    data = {
      ...data,
      title: title.trim(),
      description: description.trim(),
      duration: Number(duration),
      startDate: new Date(date),
      recurrence,
    };
    // if recurrence is checked, get recurrence info
    if (recurrence) {
      data = {
        ...data,
        recurrenceInfo: { create: recRef.current?.returnRecInfo() },
      };
    }
    // get sorting info from sortblock
    data = {
      ...data,
      sortingInfo: { create: sortRef.current?.returnSortInfo() },
    };
    createTask({data:data as Task,setRefreshing:setLoading});
  };

  const onChangeDate = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || new Date();
    setDate(currentDate);
  };

  const showMode = (
    currentMode: "time" | "date",
    date: Date,
    onChange?: ((event: DateTimePickerEvent, date?: Date) => void) | undefined
  ) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  return (
    <>
    <Stack.Screen options={{ title: "Add Task" }} />
    <ScrollView style={{}}>
      <ThemedView style={[styles.mainContainer, { paddingBottom: 180 }]}>
        {/* <ThemedView style={styles.titleContainer}>
          <BackButton/>
          <ThemedText type="title">Add/Edit Task</ThemedText>
        </ThemedView> */}
        {/* title text input */}
        <ThemedView style={styles.stepContainer}>
          <ThemedTextInput
            placeholder="Task Title"
            value={title}
            onChangeText={setTitle}
          />
          {!title.trim() && attemptedSubmit && (
            <ThemedText type="error">Task needs a title!</ThemedText>
          )}
        </ThemedView>
        {/* description input */}
        <ThemedView style={styles.stepContainer}>
          <ThemedTextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
          />
        </ThemedView>
        {/* set date of first*/}
        <ThemedView style={styles.titleContainer}>
          <ThemedText>Date: </ThemedText>
          <ThemedButton
            onPress={() => showMode("date", date, onChangeDate)}
            text={date.toLocaleDateString()}
          />
          <ThemedText>Time: </ThemedText>
          <ThemedButton
            onPress={() => showMode("time", date, onChangeDate)}
            text={date.toLocaleTimeString()}
          />
        </ThemedView>
        {/* set recurrence */}
        <Collapsible
          title={recurrence ? "Repetition Settings" : "Repetition: Off"}
          isOpen={recurrence}
          setIsOpen={setRecurrence}
        >
          <RecurrenceBlock rInfo={task?.recurrenceInfo} ref={recRef} />
        </Collapsible>
        {/* duration input */}
        <ThemedView style={styles.stepContainer}>
          <ThemedTextInput
            placeholder="Minutes to complete task"
            value={duration}
            onChangeText={(text) => {
              const numeric = text.replace(/[^0-9]/g, ""); // removes anything not 0–9
              setDuration(numeric);
            }}
          />
          {!duration && (
            <InfoBox text="Leave this blank for an AI recommendation!" />
          )}
        </ThemedView>
        <SortingBlock sorting={task?.sortingInfo} ref={sortRef} />
        {/* save button */}
        <ThemedButton text="Save!" onPress={handleSubmit} type="subtitle" />
      </ThemedView>
    </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
    zIndex: 0,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  smallTextInput: {
    flex: 1,
  },
  mainContainer: {
    gap: 8,
    flexDirection: "column",
    padding: 16,
    marginTop: 32,
  },
  colContainer: {
    gap: 8,
    flexDirection: "column",
  },
});
export default Add;
