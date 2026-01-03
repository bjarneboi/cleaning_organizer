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
import { auth, db } from "../../utils/FirebaseConfig";
import { getUserDataFromDatabase } from "../../services/userService";
import {
  BACKGROUND_COLOR,
  CALM_WHITE,
  FULL_BLACK,
  FULL_WHITE,
} from "../../constants/colors";

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

    throw new Error("Username was not found");
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
          alert("Username was not found: " + error.message);
          setIsLoading(false);
          return;
        }
      }

      const user = await signInWithEmailAndPassword(auth, loginName, password);
      if (user.user) {
        const thisUser = await getUserDataFromDatabase();

        if (!thisUser) {
          throw new Error("Userdata ERROR");
        }

        if (!thisUser.collective || !thisUser.room) {
          router.replace("/(misc)/unhoused");
        } else {
          router.replace("/(tabs)/home");
        }
      }
    } catch (error: any) {
      console.log(error);
      alert("Login failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Cleaning</Text>

      <TextInput
        style={styles.authInput}
        placeholder="Username"
        placeholderTextColor="#888888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.authInput}
        placeholder="Password"
        placeholderTextColor="#888888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        style={styles.authButton}
        onPress={signIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.authButtonText}>Log in</Text>
        )}
      </Pressable>

      <Link href="/register" style={styles.link}>
        <Text style={styles.linkText}>New user? Click here to register</Text>
      </Link>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: BACKGROUND_COLOR,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: CALM_WHITE,
  },
  link: {
    marginTop: 20,
  },
  linkText: {
    color: "#007AFF",
  },

  authInput: {
    width: "90%",
    height: 50,
    borderColor: FULL_WHITE,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: FULL_WHITE,
  },
  authButton: {
    backgroundColor: FULL_WHITE,
    paddingVertical: 15,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: FULL_BLACK,
  },
  authLink: {
    marginTop: 20,
  },
});
