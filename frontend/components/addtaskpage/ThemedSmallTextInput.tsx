import React, { useState } from "react";
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
} from "react-native";

export type Props = TextInputProps & {
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  text:string|undefined;
  onChangeText:(text:string)=>void;
};

export default function ThemedSmallTextInput({ type = "default" ,text,onChangeText}: Props) {
  const [inputWidth, setInputWidth] = useState(10); // minimum width

  return (
    <View style={styles.container}>
      <Text
        style={[styles.hiddenText, styles[type]]}
        onLayout={(e) => setInputWidth(e.nativeEvent.layout.width + 2)} // padding
      >
        {text}
      </Text>

      <TextInput
        value={text}
        style={[styles.input, { width: inputWidth }, styles[type]]}
        placeholderTextColor={'#818181ff'}
        onChangeText={onChangeText}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 2,
    paddingVertical:0,
    flexDirection: "row",
    width:'auto'
  },
  hiddenText: {
    position: "absolute",
    opacity: 0,
  },
  input: {
    minWidth:50,
    color:'#ffffff'
  },
  default: {
    fontSize: 16,
    lineHeight: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
