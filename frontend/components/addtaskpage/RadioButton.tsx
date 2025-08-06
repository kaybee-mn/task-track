import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Children, ReactNode } from "react";

type Props = {
  index: number;
  selected: number;
  setSelected: () => void;
  children: ReactNode;
};

export default function RadioButton({
  index,
  selected,
  setSelected,
  children,
}: Props) {
    const styles = createStyles(index)
  return (
    <ThemedView style={styles.titleContainer}>
      <TouchableOpacity onPress={setSelected} style={{}}>
        <Ionicons
          name={
            selected === index
              ? "radio-button-on-outline"
              : "radio-button-off-outline"
          }
          size={20}
          color="#fff"
        />
      </TouchableOpacity>
      <ThemedView
        pointerEvents={selected !== index ? "none" : "auto"}
        style={[styles.container, selected !== index && styles.disabled]}
      >
        {children}
      </ThemedView>
    </ThemedView>
  );
}

const createStyles = (index:number)=>StyleSheet.create({
  container: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
    zIndex: 4-index,
  },
});
