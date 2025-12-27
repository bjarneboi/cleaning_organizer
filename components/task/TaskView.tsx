import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Task } from "../../types/task";
import TaskCard from "./TaskCard";
import { getCurrentWeekNumber } from "bb-ts-datetime";

export default function TaskView({
  tasks,
  onRefresh,
  useInsets = true,
}: {
  tasks: Task[];
  onRefresh: () => void;
  useInsets?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const currentWeekNumber = getCurrentWeekNumber();

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
                week={currentWeekNumber}
                onRefresh={onRefresh}
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
    marginBottom: 100,
  },

  flatList: {
    width: "90%",
  },

  nestedView: {
    flexDirection: "column",
  },
});
