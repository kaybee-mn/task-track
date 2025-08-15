import React, { useState, useRef } from "react";
import { View, Text, Button } from "react-native";
import Voice from "@react-native-voice/voice";

const AudioInput=()=> {
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const silenceTimer = useRef<number | null>(null);

  const startListening = async () => {
    
  };

 

  const stopListening = async () => {
    
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={listening ? "Stop Recording" : "Start Recording"}
        onPress={listening ? stopListening : startListening}
      />
      <Text style={{ marginTop: 20 }}>Transcript: {text}</Text>
    </View>
  );
}

export default AudioInput;