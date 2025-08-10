import { View, TextInput, Text } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import DailySchedule from "../../components/taskpage/DailySchedule";
import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedButton } from "@/components/ThemedButton";
import { useState } from "react";
import { router } from "expo-router";
import { ROUTES } from "@/constants/routes";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [isValidPassword, setIsValidPassword] = useState<boolean>(true);

  const checkEmailValidity = () => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.toLowerCase());
    setIsValidEmail(isValid);
    return isValid;
  };
  const checkPasswordValidity = () => {
    const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(
      password
    );
    setIsValidPassword(isValid);
    return isValid;
  };
  const handleSignup = async () => {
    if (!(checkEmailValidity() && checkPasswordValidity())) return;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/signup`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        timezone,
      }),
      headers: { "Content-Type": "application/json" },
    }).catch((err) => console.error("Signup Error:", err));
  };
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Sign Up</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Email: </ThemedText>
        <ThemedTextInput
          placeholder="Enter email..."
          value={email}
          onChangeText={setEmail}
          onBlur={checkEmailValidity}
        />
        {!isValidEmail && (
          <ThemedText type="error">Please enter a valid email</ThemedText>
        )}
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Password: </ThemedText>
        <ThemedTextInput
          placeholder="Enter password..."
          secureTextEntry={true}
          onBlur={checkPasswordValidity}
          onChangeText={setPassword}
          value={password}
          textContentType="newPassword"
          autoComplete="new-password"
        />
        {!isValidPassword && (
          <ThemedText type="error">
            Please enter a valid password with at least 8 characters, one
            uppercase letter, one lowercase letter, one special character, and
            one number
          </ThemedText>
        )}
      </ThemedView>
      <ThemedButton onPress={handleSignup} type="subtitle" />
      <ThemedButton
        onPress={() => {
          router.replace(ROUTES.LOGIN);
        }}
        type="subtitle"
        text="Back to Login"
      />
    </ParallaxScrollView>
  );
};
const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
export default Login;
