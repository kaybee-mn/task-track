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
import { router, usePathname } from "expo-router";
import { ROUTES } from "@/constants/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/api/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [isValidPassword, setIsValidPassword] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
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
  const handleReconfirm = async () => {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/confirmation`, {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    if(!response.ok){
      setMessage("Resend failed")
    }else{
      setMessage("Confirmation email sent!")
    }

  };

  const handleLogin = async () => {
    if (!(checkEmailValidity() && checkPasswordValidity())) {
      setMessage("Incorrect username or password");
      return;
    }
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error.code);
      }
      await AsyncStorage.setItem("session", JSON.stringify(data.session));
      console.log("Login successful", data);
      router.push(ROUTES.HOME);
    } catch (err) {
      console.error(
        "Login Error:",
        String(err).includes("email_not_confirmed")
      );
      if (String(err).includes("email_not_confirmed")) {
        setMessage("Please check your email to confirm your account!");
      } else {
        setMessage("Incorrect username or password");
      }
    }
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
        <ThemedText type="title">Login</ThemedText>
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
          onChangeText={setPassword}
          value={password}
          onSubmitEditing={handleLogin}
        />
        {message && (
          <ThemedText type="error" style={{ textAlign: "center" }}>
            {message}
          </ThemedText>
        )}
        {message.includes("confirm ")||message.includes("failed") && (
          <ThemedText type="link" onPress={handleReconfirm}>
            Resend Confirmation Email
          </ThemedText>
        )}
      </ThemedView>
      <ThemedButton text="Login" onPress={handleLogin} type="subtitle" />
      <ThemedView style={{ marginTop: 24 }}>
        <ThemedText
          type="default"
          style={{ textAlign: "center", paddingBottom: 8 }}
        >
          Don't have an account?
        </ThemedText>
        <ThemedButton
          text="Create an Account"
          onPress={() => {
            router.push(ROUTES.SIGNUP);
          }}
          type="subtitle"
        />
      </ThemedView>
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
