import { auth, db } from "../utils/FirebaseConfig";
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const setTaskCompletedStatus = async (week: number, room: string, completed: boolean) => {
    const userID = auth.currentUser?.uid;
    if (!userID) return false;

    const userSnap = await getDoc(doc(db, "users", userID));
    const userData = userSnap.data();
    if (!userData) return false;

    const collective = userData.collective;

    await updateDoc(doc(db, "collectives", collective, "weeks", week.toString(), "tasks", room), {
        completed: completed,
    });

    return true;
}
