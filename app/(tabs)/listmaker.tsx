import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TaskView from "../../components/task/TaskView";
import { Task } from "../../types/task";

const Listmaker = () => {
  return (
    <ScrollView
      style={styles.container}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    ></ScrollView>
  );
};

export default Listmaker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 1,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
});
