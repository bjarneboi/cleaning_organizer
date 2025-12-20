import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import Button from "../../components/Button";

interface Task {
  task: string;
  room: string;
  completed: boolean;
}

const ListDummy = [
  { task: "Task 1", room: "H0201", completed: false },
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

const Home = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={ListDummy}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={{ alignItems: "center" }}>
            <Text style={styles.weekText}>Week 77</Text>
          </View>
        }
        renderItem={({ item }: { item: Task }) => (
          <Text style={{ textAlign: "center" }}>
            {item.task} - {item.room} - {item.completed ? "Done" : "Not done"}
          </Text>
        )}
      ></FlatList>
      <Button
        text="Go to Listmaker"
        path="/(tabs)/Listmaker"
        buttonStyle={styles.button}
        buttonTextStyle={{ color: "black", fontSize: 18 }}
      ></Button>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "black",
    borderWidth: 1,
  },

  list: {
    flexGrow: 1,
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
  },

  weekText: {
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "#E1F8D7",
    paddingVertical: 15,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
});
