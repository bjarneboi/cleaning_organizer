import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { CALM_WHITE } from "../../constants/colors";

interface ProfileSettingCardProps {
  setting: string;
  settingInfo?: string;
}

export const ProfileSettingCard = ({
  setting,
  settingInfo,
}: ProfileSettingCardProps) => {
  return (
    <View
      style={[
        styles.profileSettingCardContainer,
        {
          flexDirection: "row",
          gap: 5,
        },
      ]}
    >
      <Text style={[styles.profileText, { fontWeight: "bold" }]}>
        {setting}:
      </Text>

      <Text style={styles.profileText}>
        {settingInfo ? settingInfo : "Ikke satt"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  profileText: {
    fontSize: 16,
    color: CALM_WHITE,
  },
  profileSettingCardContainer: {
    width: "100%",
    marginBottom: 5,
  },
});
