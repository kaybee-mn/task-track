import { forwardRef, useImperativeHandle, useState } from "react";
import { SortingInfo } from "../../../shared/types/task";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import ThemedSmallTextInput from "./ThemedSmallTextInput";
import { StyleSheet } from "react-native";
import DropdownMenu from "./Dropbox";

type Props = {
  sorting?: SortingInfo;
};
export type SortRef = {
  returnSortInfo: () => SortingInfo;
};

const SortingBlock = forwardRef<SortRef, Props>(({ sorting }, ref) => {
  const ratings = Array.from({ length: 10 }, (_, index) => index + 1);
  const [priority, setPriority] = useState<number>(sorting?.priority || 5);
  const [difficulty, setDifficulty] = useState<number>(
    sorting?.difficulty || 5
  );
  const [location, setLocation] = useState<string>(sorting?.location || "");
  const returnSortInfo = () => {
    const data: any = {
      priority,
      difficulty,
      location
    };
    return data;
  };
  useImperativeHandle(ref, () => ({
    returnSortInfo,
  }));
  return (
    <ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText>Priority: </ThemedText>
        <DropdownMenu
          options={ratings}
          setSelected={(newVal: number) => {
            setPriority(newVal - 1);
          }}
          selected={priority}
        />
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText>Difficulty: </ThemedText>
        <DropdownMenu
          options={ratings}
          setSelected={(newVal: number) => {
            setDifficulty(newVal - 1);
          }}
          selected={difficulty}
        />
      </ThemedView>
      <ThemedView style={styles.titleContainer}>
        <ThemedText>Location: </ThemedText>
        <ThemedSmallTextInput
          text={location}
          placeholder="Kitchen"
          onChangeText={setLocation}
        />
      </ThemedView>
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colContainer: {
    gap: 8,
    flexDirection: "column",
  },
});

export default SortingBlock;
