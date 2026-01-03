import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { CALM_WHITE } from "../../constants/colors";

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
    <View style={styles.formContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.settingText}>{setting}: </Text>

        {isEditing ? (
          <TextInput
            style={styles.inlineInput}
            value={value}
            onChangeText={onChangeText}
            autoFocus={true}
          />
        ) : (
          <Text style={styles.valueText} numberOfLines={1} ellipsizeMode="tail">
            {value ? value : "Missing info"}
          </Text>
        )}
      </View>

      <Pressable
        style={styles.smallButton}
        onPress={isEditing ? onSavePress : onEditPress}
      >
        <Feather
          name={isEditing ? "check" : "edit-3"}
          size={22}
          color={CALM_WHITE}
        />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: "100%",
    fontSize: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: CALM_WHITE,
  },

  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  settingText: {
    fontSize: 16,
    fontWeight: "bold",
    color: CALM_WHITE,
  },

  valueText: {
    fontSize: 16,
    color: CALM_WHITE,
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
