import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { use, useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { getUserDataFromDatabase } from "../../services/userService";

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
          name="home"
          options={{
            title: "Hjem",
            tabBarIcon: ({ color, size, focused }) => (
              <Feather name="home" size={34} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="listmaker"
          options={{
            title: "Listmaker",
            tabBarIcon: ({ color, size, focused }) => (
              <Feather name="image" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Feather name="user" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen name="settings" options={{ href: null }} />
        <Tabs.Screen name="showlist" options={{ href: null }} />
      </Tabs>
    </SafeAreaView>
  );
};
export default _Layout;
