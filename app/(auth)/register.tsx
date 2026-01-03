import { Link, useRouter } from "expo-router";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
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
import {
  BACKGROUND_COLOR,
  CALM_WHITE,
  FULL_WHITE,
} from "../../constants/colors";

const userData = collection(db, "users");

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [realname, setRealname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const realnameRef = useRef(null);

  const addUserFirestore = async (
    uid: string,
    username: string,
    email: string,
    realname: string
  ) => {
    await setDoc(doc(db, "users", uid), {
      username: username,
      email: email,
      realname: realname,
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
      alert("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      if (!(await checkUsernameAvailability(username))) {
        alert("Username is already taken.");
        return;
      }
      if (!(await checkEmailAvailability(email))) {
        alert("This email is already registered.");
        return;
      }

      const userTemp = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (userTemp.user) {
        await addUserFirestore(userTemp.user.uid, username, email, realname);
        await signOut(auth);
        alert("Registration successful! You can now log in.");
        router.replace("/(auth)/login");
      }
    } catch (error: any) {
      console.log(error);
      alert("Registration failed: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Text style={styles.title}>Register new user</Text>

      <TextInput
        ref={emailRef}
        style={styles.authInput}
        placeholder="Email"
        placeholderTextColor="#888888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        ref={usernameRef}
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
      <TextInput
        style={styles.authInput}
        placeholder="Confirm Password"
        placeholderTextColor="#888888"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TextInput
        ref={realnameRef}
        style={styles.authInput}
        placeholder="Real Name"
        placeholderTextColor="#888888"
        value={realname}
        onChangeText={setRealname}
        autoCapitalize="none"
      />

      <Pressable
        style={styles.authButton}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.authButtonText}>Register</Text>
        )}
      </Pressable>

      <Link href="/login" style={styles.link}>
        <Text style={styles.linkText}>Back to login</Text>
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
    color: "#000000",
  },
  authLink: {
    marginTop: 20,
  },
});
