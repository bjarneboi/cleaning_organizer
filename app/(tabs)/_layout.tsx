import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";

const _Layout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle:
            Platform.OS === "ios"
              ? { height: 50, paddingTop: 5, paddingBottom: 2 }
              : { height: 60, paddingTop: 5, paddingBottom: 5 },

          tabBarItemStyle:
            Platform.OS === "ios"
              ? { paddingVertical: 7 }
              : { paddingVertical: 0 },
          tabBarLabelStyle: { fontSize: 12 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Hjem",
            tabBarIcon: ({ color, size, focused }) => (
              <Feather name="home" size={34} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="Listmaker"
          options={{
            title: "Feed",
            tabBarIcon: ({ color, size, focused }) => (
              <Feather name="image" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen name="settings" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
};
export default _Layout;
