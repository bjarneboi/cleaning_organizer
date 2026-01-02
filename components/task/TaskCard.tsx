import { router } from "expo-router";
import React, { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getUserDataFromDatabase } from "../../services/userService";
import { setTaskCompletedStatus } from "../../services/taskService";

interface TaskCardProps {
  room: string;
  task: string;
  completed: boolean;
  week: number;
  onRefresh: () => void;
}

const TaskCard = ({
  room,
  task,
  completed,
  week,
  onRefresh,
}: TaskCardProps) => {
  const [userData, setUserData] = React.useState<any>(null);
  const [currentYear, setCurrentYear] = React.useState<number>(
    new Date().getFullYear()
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserDataFromDatabase();

      if (!userData) return;

      setUserData(userData);
    };
    fetchUserData();
  }, []);

  const onPress = async () => {
    if (userData.room !== room) {
      alert("You can only update tasks for your own room.");
      return;
    }

    if (!completed) {
      await setTaskCompletedStatus(week, room, true, currentYear);
      alert("Task marked as completed!");
      onRefresh();
    } else {
      await setTaskCompletedStatus(week, room, false, currentYear);
      alert("Task marked as not completed!");
      onRefresh();
    }
  };

  return (
    <Pressable
      style={completed ? styles.cardC : styles.cardNC}
      onPress={onPress}
    >
      <View style={styles.topRow}>
        <Text style={styles.textRoom}>{room}</Text>
        <Text style={styles.textCompleted}>
          {completed ? "Completed" : "Not Completed"}
        </Text>
      </View>
      <Text style={styles.textTask}>{task}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardNC: {
    width: "100%",
    marginTop: 16,
    padding: 12,
    borderRadius: 0,
    borderColor: "#000000ff",
    borderWidth: 4,
    backgroundColor: "#c72929d3",
  },

  cardC: {
    width: "100%",
    marginTop: 16,
    padding: 12,
    borderRadius: 0,
    borderColor: "#000000ff",
    borderWidth: 4,
    backgroundColor: "#39c24bff",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textRoom: {
    fontSize: 20,
    flex: 1,
    fontWeight: "bold",
  },

  textCompleted: {
    fontSize: 20,
    fontWeight: "bold",
  },

  textTask: {
    fontSize: 16,
    marginTop: 8,
    flex: 1,
  },
});

export default TaskCard;
