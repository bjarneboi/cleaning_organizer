import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { auth, db } from "@/utils/FirebaseConfig";
import { styles as globalStyles } from "../styles";

export default function LoginScreen() {
  const userData = collection(db, "users");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const isEmail = (input: string) => {
    if (input.includes("@")) {
      return true;
    } else {
      return false;
    }
  };

  const getEmailFromUsername = async (username: string) => {
    const usernameQuery = query(userData, where("username", "==", username));
    const getQuery = await getDocs(usernameQuery);

    if (!getQuery.empty) {
      return getQuery.docs[0].get("email");
    }

    throw new Error("Brukernavn finnes ikke");
  };

  const signIn = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      let loginName = username;

      if (!isEmail(username)) {
        try {
          const email = await getEmailFromUsername(username);
          loginName = email;
        } catch (error: any) {
          alert("Brukernavnet ble ikke funnet: " + error.message);
          setIsLoading(false);
          return;
        }
      }

      const user = await signInWithEmailAndPassword(auth, loginName, password);
      if (user.user) {
        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      console.log(error);
      alert("Innlogging feilet: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={localStyles.container} behavior="padding">
      <Text style={localStyles.title}>PerleSted</Text>

      <TextInput
        style={globalStyles.authInput}
        placeholder="Brukernavn"
        placeholderTextColor="#888888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={globalStyles.authInput}
        placeholder="Passord"
        placeholderTextColor="#888888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        style={globalStyles.authButton}
        onPress={signIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={globalStyles.authButtonText}>Logg inn</Text>
        )}
      </Pressable>

      <Link href="/register" style={localStyles.link}>
        <Text style={localStyles.linkText}>Ny bruker? Registrer deg</Text>
      </Link>
    </KeyboardAvoidingView>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333333",
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: "#007AFF",
  },
});
