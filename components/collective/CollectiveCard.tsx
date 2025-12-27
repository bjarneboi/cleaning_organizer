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

const CollectiveCard = ({ name }: { name: string }) => {
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
  const onPress = () => {};

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.textName}>{name}</Text>
      <Text
        style={styles.textName}
      >{`Space: ${occupiedRooms} / ${roomsTotal}`}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginTop: 16,
    padding: 12,
    borderRadius: 0,
    borderColor: "#000000ff",
    borderWidth: 2,
    backgroundColor: "#dd2424a8",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textName: {
    fontSize: 20,
    flex: 1,
    fontWeight: "bold",
  },
});

export default CollectiveCard;
