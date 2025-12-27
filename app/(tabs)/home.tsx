import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import TaskView from "../../components/task/TaskView";
import { Task } from "../../types/task";
import { getCurrentWeekNumber } from "bb-ts-datetime";
import { setUserCollective } from "../../services/userService";

const Home = () => {
  const listDummy = [
    {
      task: "Task 1d dd d d ddd ddd dd dd dd d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d d",
      room: "H0201",
      completed: false,
    },
    { task: "Task 2", room: "H0202", completed: true },
    { task: "Task 3", room: "H0203", completed: false },
    { task: "Task 4", room: "H0204", completed: true },
    { task: "Task 5", room: "H0205", completed: false },
    { task: "Task 6", room: "H0206", completed: true },
    { task: "Task 7", room: "H0207", completed: false },
    { task: "Task 8", room: "H0208", completed: true },
    { task: "Task 9", room: "H0209", completed: false },
    { task: "Task 10", room: "H0210", completed: true },
    { task: "Task 11", room: "H0211", completed: false },
    { task: "Task 12", room: "H0212", completed: true },
    { task: "Task 13", room: "H0213", completed: false },
    { task: "Task 14", room: "H0214", completed: true },
  ];

  const [userData, setUserData] = useState<any>(null);
  const [tasks, setTasks] = useState<Task[]>(listDummy);
  const [week, setWeek] = useState<number>(getCurrentWeekNumber());
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const [day, setDay] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [collective, setCollective] = useState<string>("");
  const [room, setRoom] = useState<string>("");

  useEffect(() => {
    const today = new Date();

    setDay(today.getDate());
    setMonth(today.getMonth() + 1);
    setCurrentYear(today.getFullYear());

    setCollective("A2");
    setRoom("H0201");

    setUserCollective("A2", "H0201");

    /*
    const uD = getUserDataFromDatabase();

    if (!uD) return;

    setUserData(uD);

    if (!userData || !userData.collective || !userData.room) return;{

    setCollective(userData.collective || null);
    setRoom(userData.room || null);
    */
  }, []);

  return (
    <ScrollView
      style={styles.container}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Collective: {collective} - Week: {week}
      </Text>
      <TaskView tasks={tasks} useInsets={false}></TaskView>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 1,
    backgroundColor: "#ffffffce",
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
});
