import { useEffect, useState, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "../api/supabaseClient";
import { router, usePathname } from "expo-router";
import { ROUTES } from "@/constants/routes";

import { View, ActivityIndicator } from "react-native";
import Loading from "@/components/Loading";

type Props = {
  children: ReactNode;
};

export default function AuthWrapper({ children }: Props) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log(session)
      setLoading(false);
      if (!session && !(pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP))
        router.replace(ROUTES.LOGIN);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && !(pathname === ROUTES.LOGIN || pathname === ROUTES.SIGNUP))
        router.replace(ROUTES.LOGIN);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <Loading/>
    );
  }

  return <>{children}</>;
}
