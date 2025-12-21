import { Stack, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { auth } from "../utils/FirebaseConfig";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const inTabsGroup = segments[0] === "(tabs)";
      const inAuthGroup = segments[0] === "(auth)";

      if (user && !inTabsGroup) {
        router.replace("/(tabs)/home");
      } else if (!user && !inAuthGroup) {
        router.replace("/(auth)/login");
      }

      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [segments]);

  const styles = StyleSheet.create({
    authContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      backgroundColor: "#FFFFFF",
    },
  });

  if (initializing) {
    return (
      <View style={styles.authContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
