import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { SortedTask, Task } from "../../../shared/types/task";
import { ThemedText } from "../ThemedText";
import Checkbox from "../addtaskpage/Checkbox";
import { ThemedView } from "../ThemedView";
import { router } from "expo-router";
import { ROUTES } from "@/constants/routes";

export default function TaskBlock({
  task,
  onCheck,
  startState = false,
}: {
  task: SortedTask;
  onCheck: () => void;
  startState?: boolean;
}) {
  const styles = getStyles(task.duration || 300);
  return (
    <ThemedView style={styles.item}>
      <Checkbox
        value={task.completed}
        onValueChange={() => {
          onCheck();
        }}
      >
        <TouchableOpacity onPress={()=>{router.push({pathname:ROUTES.TASK,params:{taskId:task.id}})}}>
          <ThemedText type="subtitle">{task.title}</ThemedText>
        </TouchableOpacity>
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
