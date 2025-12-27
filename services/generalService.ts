import { collection, doc, getDoc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../utils/FirebaseConfig";

export const getRoomsInCollective = async (collective: string): Promise<string[]> => {
    const snap = await getDocs(
        collection(db, "collectives", collective, "rooms")
    );

    return snap.docs.map(doc => doc.id);
}

export const getCollectiveDataFromDatabase = async (collective: string) => {
    const collectiveSnap = await getDoc(doc(db, "collectives", collective));
    return collectiveSnap.data();
}

export const fillCollectiveWithRooms = async (collective: string, rooms: string[]) => {
    const collectiveRef = doc(db, "collectives", collective);
    
    await setDoc(
        doc(db, "collectives", collective), 
        {},
        { merge: true },
    )

    for (const room of rooms) {
        await setDoc(
            doc(db, "collectives", collective, "rooms", room),
            {
                room,
                occupied: false,
                occupant: null,
            }, 
            { merge: true }
        );
    }
}