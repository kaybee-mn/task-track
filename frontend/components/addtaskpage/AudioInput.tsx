import React, { useState, useRef, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { ThemedText } from "../ThemedText";
import {
  AudioRecording,
  useAudioRecorder,
  ExpoAudioStreamModule,
  RecordingConfig,
} from "@siteed/expo-audio-studio";
import { AudioAnalysisEvent } from "@siteed/expo-audio-studio/build/types/events";

const AudioInput = () => {
  const [text, setText] = useState("");
  const silenceTimer = useRef<number | null>(null);
  const { startRecording, stopRecording, isRecording, analysisData } =
    useAudioRecorder();

  const [audioResult, setAudioResult] = useState<AudioRecording | null>(null);

  const startListening = async () => {
    setText("");
    const { status } = await ExpoAudioStreamModule.requestPermissionsAsync();
    if (status !== "granted") {
      console.log("permission not granted");
      return;
    }

    const config: RecordingConfig = {
      interval: 500, // Emit recording data every 500ms
      enableProcessing: true, // Enable audio analysis
      sampleRate: 44100, // Sample rate in Hz (16000, 44100, or 48000)
      channels: 1, // Mono recording
      encoding: "pcm_16bit", // PCM encoding (pcm_8bit, pcm_16bit, pcm_32bit)

      // Optional: Configure audio output files
      output: {
        // Primary WAV file (enabled by default)
        primary: {
          enabled: true, // Set to false to disable WAV file creation
        },
        // Compressed file (disabled by default)
        compressed: {
          enabled: false, // Set to true to enable compression
          format: "aac", // 'aac' or 'opus'
          bitrate: 128000, // Bitrate in bits per second
        },
      },
      // Optional: Handle audio stream data
      onAudioStream: async (audioData) => {
        // call assemblyai
      },

      // Optional: Handle audio analysis data
      onAudioAnalysis: async (e: AudioAnalysisEvent) => {
        console.log(`onAudioAnalysis`, e);
        if (e.speechAnalysis && e.amplitudeRange.max > 0.4) {
          resetSilenceTimer();
        }
      },

      // Optional: Auto-resume after interruption
      autoResumeAfterInterruption: false,

      // Optional: Buffer duration control
      bufferDurationSeconds: 0.1, // Buffer size in seconds
      // Default: undefined (uses 1024 frames, but iOS enforces minimum 0.1s)
    };
    const startResult = await startRecording(config);
    return startResult;
  };

  const resetSilenceTimer = () => {
    if (silenceTimer.current) clearTimeout(silenceTimer.current);
    silenceTimer.current = setTimeout(() => {
      stopListening();
    }, 2000); // stop after 2s of silence
  };

  const stopListening = async () => {
    const result = await stopRecording();
    setAudioResult(result);
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={isRecording ? "Stop Recording" : "Start Recording"}
        onPress={isRecording ? stopListening : startListening}
      />
      <ThemedText style={{ marginTop: 20 }}>Transcript: {text}</ThemedText>
    </View>
  );
};

export default AudioInput;
