import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TaskCardProps {
  room: string;
  task: string;
  completed: boolean;
}

const TaskCard = ({ room, task, completed }: TaskCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.textRoom}>{room}</Text>
        <Text style={styles.textCompleted}>
          {completed ? "Completed" : "Not Completed"}
        </Text>
      </View>
      <Text style={styles.textTask}>{task}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    borderColor: "grey",
    borderWidth: 1,
    backgroundColor: "#fff",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textRoom: {
    fontSize: 20,
    flex: 1,
  },

  textCompleted: {},

  textTask: {
    fontSize: 16,
    marginTop: 8,
    flex: 1,
  },
});

export default TaskCard;
