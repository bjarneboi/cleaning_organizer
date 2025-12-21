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



