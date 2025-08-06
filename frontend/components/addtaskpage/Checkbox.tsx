import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "../ThemedText";
import { TouchableOpacity } from "react-native";
import Fontisto from "@expo/vector-icons/Fontisto";
import { ReactNode } from "react";
import { ThemedView } from "../ThemedView";

type Props = {
  value: boolean;
  onValueChange: () => void;
  children:ReactNode;
  size?:number
};

export default function Checkbox({ value, onValueChange, children,size }: Props) {
  return (
    <ThemedView style={{flexDirection:'row', alignItems:'center'}}>
      <TouchableOpacity onPress={onValueChange} style={{marginRight:8}}>
        <Fontisto
          name={value ? "checkbox-active" : "checkbox-passive"}
          color="#ffffff"
          size={size||16}
        />
      </TouchableOpacity>
      {children}
    </ThemedView>
  );
}
