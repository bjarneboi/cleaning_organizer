import { Image } from "expo-image";
import { signOut } from "firebase/auth";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SettingCard } from "../../components/settings/SettingCard";
import { auth } from "../../utils/FirebaseConfig";
import { useProfileSettings } from "../../hooks/useProfileSettings";
import {
  BACKGROUND_COLOR,
  CALM_WHITE,
  FULL_WHITE,
} from "../../constants/colors";

const Settings = () => {
  const {
    username,
    email,
    phoneNumber,
    imageUrl,
    placed,
    realname,
    collective,
    room,
    activeField,
    tempValue,
    setTempValue,
    handleStartEdit,
    handleSave,
    handleUpdateProfileImage,
    loadingImage,
  } = useProfileSettings();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={typeof imageUrl === "string" ? { uri: imageUrl } : imageUrl}
        style={styles.image}
      />
      <Pressable
        style={styles.pictureButton}
        onPress={handleUpdateProfileImage}
        disabled={loadingImage}
      >
        <Text style={styles.formButtonText}>
          {loadingImage ? "Uploading..." : "Change Picture"}
        </Text>
      </Pressable>
      <View style={styles.settingsList}>
        <SettingCard
          setting="Username"
          value={activeField === "username" ? tempValue : username}
          isEditing={activeField === "username"}
          onChangeText={setTempValue}
          onEditPress={() => handleStartEdit("username", username)}
          onSavePress={() => handleSave("username")}
        />
        <SettingCard
          setting="Email"
          value={activeField === "email" ? tempValue : email}
          isEditing={activeField === "email"}
          onChangeText={setTempValue}
          onEditPress={() => handleStartEdit("email", email)}
          onSavePress={() => handleSave("email")}
        />
        <SettingCard
          setting="Phone number"
          value={activeField === "phoneNumber" ? tempValue : phoneNumber}
          isEditing={activeField === "phoneNumber"}
          onChangeText={setTempValue}
          onEditPress={() => handleStartEdit("phoneNumber", phoneNumber)}
          onSavePress={() => handleSave("phoneNumber")}
        />
        <SettingCard
          setting="Name"
          value={activeField === "realname" ? tempValue : realname}
          isEditing={activeField === "realname"}
          onChangeText={setTempValue}
          onEditPress={() => handleStartEdit("realname", realname)}
          onSavePress={() => handleSave("realname")}
        />
      </View>
      <View style={{ height: 20 }} />
      <Pressable style={styles.formButton} onPress={handleLogout}>
        <Text style={styles.formButtonText}>Log out</Text>
      </Pressable>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
    paddingTop: 20,
    paddingHorizontal: "5%",
    gap: 10,
    width: "100%",
    alignSelf: "center",
    backgroundColor: BACKGROUND_COLOR,
  },
  image: {
    width: 150,
    height: 150,
    borderWidth: 4,
    borderRadius: 80,
    borderColor: CALM_WHITE,
    alignSelf: "center",
  },
  pictureButton: {
    alignItems: "center",
    backgroundColor: FULL_WHITE,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  settingsList: {
    width: "100%",
    gap: 5,
  },
  formButton: {
    backgroundColor: FULL_WHITE,
    paddingVertical: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  formButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
});
export default Settings;
