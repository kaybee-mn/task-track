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
  style?:any
};

export default function RadioButton({
  index,
  selected,
  setSelected,
  children,
  style
}: Props) {
  return (
    <ThemedView style={[styles.titleContainer,style]}>
      <TouchableOpacity onPress={setSelected} style={{justifyContent:'center'}}>
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

const styles=StyleSheet.create({
  container: {
    width: "100%",
  },
  disabled: {
    opacity: 0.5,
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
