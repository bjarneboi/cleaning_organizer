import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CollectiveCard from "./CollectiveCard";
import { getCurrentWeekNumber } from "bb-ts-datetime";
import { getAllCollectives } from "../../services/generalService";

export default function CollectiveView({
  useInsets = true,
}: {
  useInsets?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const currentWeekNumber = getCurrentWeekNumber();

  const [collectives, setCollectives] = useState<string[]>([]);

  const fetchCollectives = async () => {
    const fetchedCollectives = await getAllCollectives();
    setCollectives(fetchedCollectives);
  };

  fetchCollectives();

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
          {collectives.map((item) => (
            <View key={item}>
              <CollectiveCard name={item} />
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
