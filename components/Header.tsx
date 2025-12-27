import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { getUserDataFromDatabase } from "../services/userService";

export default function Header() {
  const [userData, setUserData] = React.useState<any>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserDataFromDatabase();

      if (!userData) return;

      setUserData(userData);
    };
    fetchUserData();
  }, []);
  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Text style={styles.title}>{userData?.username}</Text>
        <Text style={styles.title}>
          {userData?.collective ? userData.collective + " - " : "Not housed"}
          {userData?.room ? userData.room : ""}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: "#7e199cff",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333333",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
});
