import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React, { use, useEffect } from "react";
import { Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../../components/Header";
import { getUserDataFromDatabase } from "../../services/userService";
import {
  BACKGROUND_COLOR,
  CALM_BLUE,
  CALM_WHITE,
  FULL_BLACK,
} from "../../constants/colors";

const _Layout = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
      <Header />
      <View style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: CALM_BLUE,
            tabBarInactiveTintColor: CALM_WHITE,
            headerShown: false,
            tabBarStyle:
              Platform.OS === "ios"
                ? {
                    height: 50,
                    paddingTop: 5,
                    paddingBottom: 2,
                    backgroundColor: BACKGROUND_COLOR,
                    borderTopWidth: 2,
                    borderTopColor: FULL_BLACK,
                  }
                : {
                    height: 60,
                    paddingTop: 5,
                    paddingBottom: 5,
                    backgroundColor: BACKGROUND_COLOR,
                    borderTopWidth: 2,
                    borderTopColor: FULL_BLACK,
                  },

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
              title: "Home",
              sceneStyle: { backgroundColor: BACKGROUND_COLOR },
              tabBarIcon: ({ color, size, focused }) => (
                <Feather name="home" size={34} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="listmaker"
            options={{
              title: "Listmaker",
              sceneStyle: { backgroundColor: BACKGROUND_COLOR },
              tabBarIcon: ({ color, size, focused }) => (
                <Feather name="image" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen
            name="profile"
            options={{
              title: "Profile",
              sceneStyle: { backgroundColor: BACKGROUND_COLOR },
              tabBarIcon: ({ color, size, focused }) => (
                <Feather name="user" size={size} color={color} />
              ),
            }}
          />

          <Tabs.Screen name="settings" options={{ href: null }} />
          <Tabs.Screen name="showlist" options={{ href: null }} />
        </Tabs>
      </View>
    </SafeAreaView>
  );
};
export default _Layout;
