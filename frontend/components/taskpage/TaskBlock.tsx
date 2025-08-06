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
    <ThemedView>
      <Checkbox
        value={checked}
        onValueChange={() => setChecked((prev) => !prev)}
      >
        <ThemedText>{task.title}</ThemedText>
      </Checkbox>
    </ThemedView>
  );
}

const getStyles = (height: number) =>
  StyleSheet.create({
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    item: {
      borderColor: "#000000",
      borderWidth: 3,
      borderRadius: 10,
      flex: 1,
      width: "70%",
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      height: 60 + height * 0.02,
      flexDirection: "row",
    },
    checkbox: {
      width: 30,
      height: 30,
      borderRadius: 15,
      borderWidth: 2,
      borderColor: "#000000",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
      display: "flex",
      flexDirection: "row",
    },
    unchecked: {
      backgroundColor: "#ffffff",
    },
    checked: {
      backgroundColor: "#00ff00",
    },
  });
