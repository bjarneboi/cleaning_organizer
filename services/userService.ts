import { auth, db } from "../utils/FirebaseConfig";
import { doc, getDoc, updateDoc } from 'firebase/firestore';


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

