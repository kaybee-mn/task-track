import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedView } from "./ThemedView";

export type ThemedTextProps = TextInputProps & {
  style?:any;
  containerStyle?:any;
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
  secureTextEntry?: boolean;
};

export function ThemedTextInput({
  style,
  containerStyle,
  lightColor,
  darkColor,
  type = "default",
  secureTextEntry = false,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const [hidePassword, setHidePassword] = useState<boolean>(secureTextEntry);

  return (
    <ThemedView style={[styles.textInput,containerStyle]}>
      <TextInput
        style={[
          { color, flex: 8 },
          styles[type],
          style,
        ]}
        placeholderTextColor={'#818181ff'}
        secureTextEntry={hidePassword}
        {...rest}
      ></TextInput>
      {secureTextEntry && (
        <Ionicons
          name={hidePassword ? "eye-off-outline" : "eye-outline"}
          color={{ color }.color}
          style={styles.icon}
          size={25}
          onPress={() => setHidePassword(!hidePassword)}
        />
      )}
    </ThemedView>
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
  textInput: {
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
  },
  icon: {
    alignSelf: "center",
    flex: 1,
  },
});
