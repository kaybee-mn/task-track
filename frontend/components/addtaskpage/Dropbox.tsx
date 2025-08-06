import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "../ThemedText";

type Props = {
  options: any[];
  selected: any;
  setSelected: (newR:number)=>void;
};

function DropdownMenu({ options, selected, setSelected }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  const handleSelect = async (index: number) => {
    setOpen(false);
    if (selected === options[index]) {
      return; // Prevent re-selecting the same option
    }
    setSelected(index);
  };
  return (
    <View>
      <TouchableOpacity onPress={() => setOpen(!open)} style={styles.container}>
        <ThemedText>{selected}</ThemedText>
        <Ionicons name={"chevron-down-outline"} size={25} color={"#ffffff"} />
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdown}>
          {options.map((option, index) => (
            option===selected?undefined:
            <TouchableOpacity key={index} onPress={() => handleSelect(index)} activeOpacity={1}>
              <ThemedText>{option}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    zIndex: 10010,
  },
  dropdown: {
    position: "absolute",
    top: 30,
    left: 0,
    right: 0,
    padding: 8,
    zIndex: 10090,
    borderTopWidth: 0,
    backgroundColor:'#1f1e1eff'
  },
});

export default DropdownMenu;
