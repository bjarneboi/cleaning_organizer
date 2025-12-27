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
      alert("Innlogging feilet: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Cleaning</Text>

      <TextInput
        style={styles.authInput}
        placeholder="Brukernavn"
        placeholderTextColor="#888888"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.authInput}
        placeholder="Passord"
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
          <Text style={styles.authButtonText}>Logg inn</Text>
        )}
      </Pressable>

      <Link href="/register" style={styles.link}>
        <Text style={styles.linkText}>Ny bruker? Registrer deg</Text>
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

  authContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFFFFF",
  },
  authTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#333333",
  },
  authInput: {
    width: "90%",
    height: 50,
    borderColor: "#DDDDDD",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#F9F9F9",
  },
  authButton: {
    backgroundColor: "#E1F8D7",
    paddingVertical: 15,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
    marginTop: 10,
  },
  authButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000000",
  },
  authLink: {
    marginTop: 20,
  },
});
