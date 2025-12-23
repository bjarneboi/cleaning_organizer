import { router } from "expo-router";
import React from "react";
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
}

const TaskCard = ({ room, task, completed, week }: TaskCardProps) => {
  const [userData, setUserData] = React.useState<any>(null);

  const fetchUserData = async () => {
    const userData = await getUserDataFromDatabase();

    if (!userData) return;

    setUserData(userData);
  };
  fetchUserData();

  const onPress = () => {
    if (!completed) {
      setTaskCompletedStatus(week, userData.room, true);
    } else {
      setTaskCompletedStatus(week, userData.room, false);
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
    borderWidth: 2,
    backgroundColor: "#dd2424a8",
  },

  cardC: {
    width: "100%",
    marginTop: 16,
    padding: 12,
    borderRadius: 0,
    borderColor: "#000000ff",
    borderWidth: 2,
    backgroundColor: "#24dd3dad",
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
