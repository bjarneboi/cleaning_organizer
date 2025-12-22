import { auth, db } from "../utils/FirebaseConfig";
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export const setTaskCompletedStatus = async (week: number) => {
    const userID = auth.currentUser?.uid;
    if (!userID) return false;

    const userSnap = await getDoc(doc(db, "users", userID));
    const userData = userSnap.data();
    if (!userData) return false;

    const collective = userData.collective;
    const room = userData.room;

    await updateDoc(doc(db, "collectives", collective, "weeks", week.toString(), "tasks", room), {
        completed: true,
    });

    return true;
}
