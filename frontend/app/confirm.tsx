import { useEffect } from "react";
import * as Linking from "expo-linking";
import { supabase } from "../api/supabaseClient"; 

export default function ConfirmScreen() {
  useEffect(() => {
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(url);
        if (error) {
          console.error("Error confirming email:", error.message);
        } else {
          console.log("User confirmed and signed in!", data);
        }
      }
    };

    handleDeepLink();
  }, []);

  return null; // Or a loading screen
}
