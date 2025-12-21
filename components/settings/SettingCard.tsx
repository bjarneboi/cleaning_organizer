import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface SettingCardProps {
  setting: string;
  value: string;
  isEditing: boolean;
  onChangeText: (text: string) => void;
  onEditPress: () => void;
  onSavePress: () => void;
}

export const SettingCard = ({
  setting,
  value,
  isEditing,
  onChangeText,
  onEditPress,
  onSavePress,
}: SettingCardProps) => {
  return (
    <View style={styles.formText}>
      <View style={{ flexDirection: "row", flex: 1, marginRight: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{setting}: </Text>

        {isEditing ? (
          <TextInput
            style={styles.inlineInput}
            value={value}
            onChangeText={onChangeText}
            autoFocus={true}
          />
        ) : (
          <Text style={{ fontSize: 16 }} numberOfLines={1} ellipsizeMode="tail">
            {value ? value : "Mangler info"}
          </Text>
        )}
      </View>

      <Pressable
        style={styles.smallButton}
        onPress={isEditing ? onSavePress : onEditPress}
      >
        <Feather name={isEditing ? "check" : "edit-3"} size={22} color="#000" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  formText: {
    width: "100%",
    fontSize: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0e8",
  },

  smallButton: {
    width: 50,
    height: 50,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  inlineInput: {
    fontSize: 16,
    color: "#000",
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    minWidth: 150,
  },
});
