import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { ThemedView } from "../ThemedView";
import { ThemedTextInput } from "../ThemedTextInput";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { addMoodNote, logMood } from "@/api/moodService";

type Props = {
  setRecentMood: React.Dispatch<React.SetStateAction<number | undefined>>;
};

const MoodChecker = ({ setRecentMood }: Props) => {
  const [note, setNote] = useState<string>("");
  const [showNote, setShowNote] = useState<boolean>(false);
  const mood = useRef<{ moodId: string; timestamp: number }>(undefined);

  useEffect(() => {
    // If the note is empty, start a 5 second timer to hide it
    if (!note.trim()) {
      const timer = setTimeout(() => {
        addNote();
      }, 5000);

      return () => clearTimeout(timer); // clear if note changes
    }
  }, [note]);

  const addNote = () => {
    setShowNote(false);
    setRecentMood(mood.current?.timestamp);
    if (!note.trim()) {
      return;
    }
    addMoodNote(note, mood.current?.moodId || "");
  };
  const handlePress = async (index: number) => {
    setNote("");
    setShowNote(true);
    const moodData = await logMood(index);
    mood.current = moodData;
  };
  const Icon = ({ name, onPress }: { name: string; onPress: () => void }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <FontAwesome6 name={name} size={36} color="white" />
      </TouchableOpacity>
    );
  };
  return (
    <ThemedView style={styles.mainContainer}>
      {!showNote ? (
        <ThemedView style={styles.container}>
          {[
            "face-frown",
            "face-frown-open",
            "face-meh",
            "face-smile",
            "face-grin",
          ].map((name, index) => (
            <Icon
              name={name}
              onPress={() => {
                handlePress(index);
              }}
              key={index}
            />
          ))}
        </ThemedView>
      ) : (
        <ThemedTextInput
          value={note}
          onChangeText={setNote}
          onSubmitEditing={addNote}
          onBlur={addNote}
          placeholder="Add a note about how you feel..."
        ></ThemedTextInput>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 16,
    gap: 8,
  },
  mainContainer: {
    width: "100%",
    alignItems: "center",
  },
});

export default MoodChecker;
