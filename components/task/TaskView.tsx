import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Task } from "../../types/task";
import TaskCard from "./TaskCard";

export default function TaskView({
  tasks,
  useInsets = true,
}: {
  tasks: Task[];
  useInsets?: boolean;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        width: "100%",
        paddingTop: useInsets ? insets.top : 0,
        paddingBottom: useInsets ? insets.bottom : 0,
        paddingHorizontal: insets.left,
      }}
    >
      <View style={styles.flatList}>
        <View style={styles.nestedView}>
          {tasks.map((item) => (
            <View key={item.room}>
              <TaskCard
                room={item.room}
                task={item.task}
                completed={item.completed}
              />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "90%",
    color: "#000",
    borderColor: "grey",
    borderRadius: 8,
  },

  flatList: {
    marginVertical: 20,
    width: "90%",
  },

  nestedView: {
    flexDirection: "column",
  },
});
