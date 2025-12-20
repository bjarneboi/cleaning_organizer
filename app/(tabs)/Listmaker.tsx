import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TaskView from "../../components/task/TaskView";
import { Task } from "../../types/task";

const Listmaker = () => {
  const tasksDummy = [
    { room: "H0201", task: "Clean the floor", completed: false },
    { room: "H0202", task: "Wash the windows", completed: true },
    { room: "H0203", task: "Dust the shelves", completed: false },
    { room: "H0204", task: "Vacuum the carpet", completed: true },
  ];

  const [tasks, setTasks] = useState<Task[]>(tasksDummy);

  return (
    <View style={{ flex: 1 }}>
      <TaskView tasks={tasks}></TaskView>
    </View>
  );
};

export default Listmaker;

const styles = StyleSheet.create({});
