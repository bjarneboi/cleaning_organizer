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
import {
  getCollectiveDataFromDatabase,
  getRoomsInCollective,
  getRoomsInCollectiveWithData,
} from "../../services/generalService";

const CollectiveCard = ({
  name,
  onPress,
}: {
  name: string;
  onPress: () => void;
}) => {
  const [roomsTotal, setRoomsTotal] = React.useState<number>(0);
  const [occupiedRooms, setOccupiedRooms] = React.useState<number>(0);

  useEffect(() => {
    const fetchCollectiveData = async () => {
      const roomsInCollective = await getRoomsInCollectiveWithData(name);
      if (!roomsInCollective) return;

      setRoomsTotal(roomsInCollective.total);
      setOccupiedRooms(roomsInCollective.occupied);
    };

    fetchCollectiveData();
  }, [name]);


  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <Text style={styles.text}>{name}</Text>
        <Text style={styles.text}>{`${occupiedRooms} / ${roomsTotal}`}</Text>
      </View>
      <Text style={styles.textJoin}>Click to join</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginTop: 16,
    padding: 20,
    borderRadius: 0,
    borderColor: "#000000ff",
    borderWidth: 2,
    backgroundColor: "#ce24dda8",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  text: {
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 15,
  },

  textJoin: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 15,
    textAlign: "center",
    marginTop: 10,
  },
});

export default CollectiveCard;
