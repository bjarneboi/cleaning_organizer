import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";
import { auth, db } from "../../utils/FirebaseConfig";

const userData = collection(db, "users");

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const usernameRef = useRef(null);
  const emailRef = useRef(null);

  const addUserFirestore = async (
    uid: string,
    username: string,
    email: string
  ) => {
    await setDoc(doc(db, "users", uid), {
      username: username,
      email: email,
      createdAt: new Date(),
    });
  };

  const checkUsernameAvailability = async (username: string) => {
    const usernameQuery = query(userData, where("username", "==", username));
    const names = await getDocs(usernameQuery);
    return names.empty;
  };

  const checkEmailAvailability = async (email: string) => {
    const emailQuery = query(userData, where("email", "==", email));
    const emails = await getDocs(emailQuery);
    return emails.empty;
  };

  const handleRegister = async () => {
    if (isLoading) return;
    if (password !== confirmPassword) {
      alert("Passordene er ikke like.");
      return;
    }

    setIsLoading(true);
    try {
      if (!(await checkUsernameAvailability(username))) {
        alert("Brukernavnet er allerede tatt.");
        return;
      }
      if (!(await checkEmailAvailability(email))) {
        alert("Denne e-posten er allerede registrert.");
        return;
      }

      const userTemp = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userTemp.user) {
        await addUserFirestore(userTemp.user.uid, username, email);
        router.replace("/(tabs)/home");
      }
    } catch (error: any) {
      console.log(error);
      alert("Registrering feilet: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Registrer ny bruker</Text>

      <TextInput
        ref={emailRef}
        style={styles.authInput}
        placeholder="Epost-adresse"
        placeholderTextColor="#888888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        ref={usernameRef}
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
      <TextInput
        style={styles.authInput}
        placeholder="Skriv inn passord på nytt"
        placeholderTextColor="#888888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Pressable
        style={styles.authButton}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.authButtonText}>Registrer</Text>
        )}
      </Pressable>

      <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>Tilbake til login</Text>
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
