import {
  View,
  StyleSheet,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Task } from "../../../shared/types/task";
import { ThemedText } from "../ThemedText";
import Checkbox from "../addtaskpage/Checkbox";
import { ThemedView } from "../ThemedView";

export default function TaskBlock({ task }: { task: Task }) {
  const [checked, setChecked] = useState(false);
  console.log("Taskblock ", task);
  const styles = getStyles(task.duration || 300);
  return (
    <ThemedView style={styles.item}>
      <Checkbox
        value={checked}
        onValueChange={() => setChecked((prev) => !prev)}
      >
        <ThemedText type="subtitle">{task.title}</ThemedText>
      </Checkbox>
    </ThemedView>
  );
}

const getStyles = (height: number) =>
  StyleSheet.create({
    item: {
      flex: 1,
      marginVertical: 8,
      flexDirection: "row",
    },
  });
