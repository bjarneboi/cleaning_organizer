import { auth, db } from "../utils/FirebaseConfig";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';


export const getUserDataFromDatabase = async () => {
    const userID = auth.currentUser?.uid;
    if (!userID) return null; 

    const user = await getDoc(doc(db, "users", userID));
    return user.data();
};

export const updateUserDatabaseField = async (fieldName: string, value: string) => {
    const userID = auth.currentUser?.uid;
    if (!userID) return false;

    await updateDoc(doc(db, "users", userID), { [fieldName]: value });
    return true;
};

export const setUserCollective = async (collective: string, room: string) => {
    const userID = auth.currentUser?.uid;
    if (!userID) return false;

    await updateDoc(doc(db, "users", userID), { collective, room });
    return true;
};

export const moveIntoCollective = async (collective: string, room: string) => {
    const userID = auth.currentUser?.uid;
    if (!userID) return false;

    await updateDoc(
    doc(db, "collectives", collective, "rooms", room), {
      occupied: true,
      occupant: userID,
    });

    return true
}

export const moveOutOfCollective = async () => {
    const userID = auth.currentUser?.uid;
    if (!userID) return false;

    const userSnap = await getDoc(doc(db, "users", userID));
    const userData = userSnap.data();
    if (!userData) return null;

    const collective = userData.collective;
    const room = userData.room;

    if (!collective || !room) return false;

    await updateDoc(
    doc(db, "collectives", collective, "rooms", room), {
      occupied: false,
      occupant: null,
    });

    return true
}

export const sendJoinRequest = async (collective: string, room: string) => {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("User not authenticated");

  const userData = await getUserDataFromDatabase();
  if (!userData) throw new Error("Missing user data");

  const username = userData.username;
  const realname = userData.realname;
  if (!username || !realname) throw new Error("Missing username/real name");

  await addDoc(collection(db, "collectives", collective, "joinRequests"), {
    userId,
    username,
    realname,
    room,
    createdAt: serverTimestamp(),
    status: "pending",
  });
};

