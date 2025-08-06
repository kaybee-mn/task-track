import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { StyleSheet } from "react-native";

type Props = {
  text: string;
};

export default function InfoBox({ text }: Props) {
  return (
    <ThemedView>
      <Ionicons name="triangle" style={styles.warningArrow} />
      <ThemedText type="default" style={styles.warningText}>
        {text}
      </ThemedText>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  warningArrow: {
    position: "relative",
    color: "#2d7bd4ff",
    left: "50%",
    top: 4,
  },
  warningText: {
    backgroundColor: "#2d7bd4ff",
    color: "#ffffff",
    textAlign: "center",
    paddingVertical: 8,
    marginHorizontal: 8,
    borderRadius: 8,
  }
});
