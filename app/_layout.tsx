import { Stack, useRouter, useSegments } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, StyleSheet } from "react-native";
import { auth } from "../utils/FirebaseConfig";
import { getUserDataFromDatabase } from "../services/userService";
import { BACKGROUND_COLOR } from "../constants/colors";

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const inTabsGroup = segments[0] === "(tabs)";
      const inAuthGroup = segments[0] === "(auth)";
      const inMiscGroup = segments[0] === "(misc)";

      if (!user) {
        if (!inAuthGroup) {
          router.replace("/(auth)/login");
        }
      } else {
        const data = await getUserDataFromDatabase();

        if (!data?.collective || !data?.room) {
          if (!inMiscGroup) {
            router.replace("/(misc)/unhoused");
          }
        } else {
          if (!inTabsGroup) {
            router.replace("/(tabs)/home");
          }
        }
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
      backgroundColor: BACKGROUND_COLOR,
    },

    root: {
      flex: 1,
    },
  });

  if (initializing) {
    return (
      <View style={styles.authContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}
