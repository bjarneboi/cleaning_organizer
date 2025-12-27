import { collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
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

export const getRoomsInCollectiveWithData = async (collective: string) => {
    const roomsSnap = await getDocs(collection(db, "collectives", collective, "rooms"));
    const occupied = roomsSnap.docs.filter((d) => d.data()?.occupied).length;

    return {
        total: roomsSnap.size,
        occupied,
    };
}

export const fillCollectiveWithRooms = async (collective: string, rooms: string[]) => {
    const collectiveRef = doc(db, "collectives", collective);
    
    await setDoc(
        doc(db, "collectives", collective), 
        {
            roomsTotal: rooms.length,
        },
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

export const getAllCollectives = async (): Promise<string[]> => {
    const snap = await getDocs(collection(db, "collectives"));
    return snap.docs.map(doc => doc.id);
}


export const isRoomAvailable = async (collective: string, room: string): Promise<boolean> => {
    const roomSnap = await getDoc(doc(db, "collectives", collective, "rooms", room));
    if (!roomSnap.exists()) return false;

    const roomData = roomSnap.data();
    return !roomData.occupied;
}

export const getJoinRequests = async (collective: string) => {
  const snap = await getDocs(
    collection(db, "collectives", collective, "joinRequests")
  );

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const approveJoinRequest = async (collective: string, requestId: string) => {
    const reqSnap = await getDoc(doc(db, "collectives", collective, "joinRequests", requestId));
    if (!reqSnap.exists()) throw new Error("Request not found");

    const { userId, room } = reqSnap.data();

    const roomRef = doc(db, "collectives", collective, "rooms", room);
    await updateDoc(roomRef, {
        occupied: true,
        occupant: userId,
    });

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
        collective,
        room,
        placedAt: serverTimestamp(),
    });

    await deleteDoc(doc(db, "collectives", collective, "joinRequests", requestId));
};

