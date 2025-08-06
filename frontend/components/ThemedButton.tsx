import {
  StyleSheet,
  Text,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useState } from "react";

export type ThemedTOProps = TouchableOpacityProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  text?:string;
};

export function ThemedButton({
  style,
  lightColor,
  darkColor,
  type = "default",
  text = "Submit!",
  ...rest
}: ThemedTOProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <TouchableOpacity style={[style, styles.container]} {...rest}>
      <Text
        style={[
          { color },
          type === "default" ? styles.default : undefined,
          type === "title" ? styles.title : undefined,
          type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
          type === "subtitle" ? styles.subtitle : undefined,
          type === "link" ? styles.link : undefined,
          styles.button
        ]}
      >{text}</Text>
      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
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
  button: {
    textAlign:'center'
  },
  container:{
    borderWidth:2,
    borderRadius:12,
    padding:8
  }
});
