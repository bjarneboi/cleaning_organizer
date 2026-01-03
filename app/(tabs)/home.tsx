import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import TaskView from "../../components/task/TaskView";
import { Task } from "../../types/task";
import { getCurrentWeekNumber, getCurrentYearString } from "bb-ts-datetime";
import {
  getUserDataFromDatabase,
  setUserCollective,
} from "../../services/userService";
import {
  getTasksForCollectiveWeek,
  setTasksForCollective,
} from "../../services/taskService";
import { BACKGROUND_COLOR, CALM_WHITE } from "../../constants/colors";

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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [week, setWeek] = useState<number>(getCurrentWeekNumber());
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [day, setDay] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [collective, setCollective] = useState<string>("");
  const [room, setRoom] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const refreshTasks = async (collective: string, week: number) => {
    const tasksForWeek = await getTasksForCollectiveWeek(
      collective,
      week,
      currentYear
    );
    setTasks(tasksForWeek ?? []);
  };

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      try {
        const uD = await getUserDataFromDatabase();
        if (!uD?.collective || !uD?.room) return;

        setUserData(uD);
        setCollective(uD.collective);
        setRoom(uD.room);

        await refreshTasks(uD.collective, week);
      } finally {
        setIsLoading(false);
      }
      /*
      await setTasksForCollective(
        [
          "Common area (TV room, accessories, bar table & dinner table)",
          "Ovenplate, Norwegian pant & filter",
          "Wash floor",
          "Vacuum floor",
          "Kitchen table, dishwasher & sink",
          "Inside oven and microwave",
          "Trash & cabinets",
        ],
        currentYear + 1
      );
      */
    };

    run();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        backgroundColor: "transparent",
        paddingBottom: 20,
      }}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>
        Collective: {collective} - Week: {week} - {currentYear}
      </Text>
      <TaskView
        tasks={tasks}
        onRefresh={() => refreshTasks(collective, week)}
        useInsets={false}
      ></TaskView>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 1,
    backgroundColor: BACKGROUND_COLOR,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
    color: CALM_WHITE,
  },
});
