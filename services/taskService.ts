import { auth, db } from "../utils/FirebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { numberOfWeeksInYear } from "bb-ts-datetime";
import { getRoomsInCollective } from "./generalService";

export const setTaskCompletedStatus = async (week: number, room: string, completed: boolean, year: number) => {
    const userID = auth.currentUser?.uid;
    if (!userID) return false;

    const userSnap = await getDoc(doc(db, "users", userID));
    const userData = userSnap.data();
    if (!userData) return false;

    const collective = userData.collective;

    await updateDoc(doc(db, "collectives", collective, "years", year.toString(), "weeks", week.toString(), "tasks", room), {
        completed: completed,
    });

    return true;
}

export const setTasksForCollective = async (tasks: String[], year: number) => {
    const userID = auth.currentUser?.uid;
    if (!userID) return false;

    const numOfWeeks = numberOfWeeksInYear(year);

    let week = 1;


    const userSnap = await getDoc(doc(db, "users", userID));
    const userData = userSnap.data();
    if (!userData) return false;
    const collective = userData.collective;

    const allTasks = tasks;

    const roomsList = await getRoomsInCollective(collective);

    const numberOfRooms = roomsList.length;



    const sideOne = roomsList.slice(0, numberOfRooms / 2);
    const sideTwo = roomsList.slice(numberOfRooms / 2, numberOfRooms);

    while (week <= numOfWeeks) {
        for (let i = 0; i < sideOne.length; i++) {
            await setDoc(
                doc(db, "collectives", collective, "years", year.toString(), "weeks", week.toString(), "tasks", sideOne[i]),
                {
                task: allTasks[i],
                completed: false,
                },
                { merge: true }
            );
            await setDoc(
                doc(db, "collectives", collective, "years", year.toString(), "weeks", week.toString(), "tasks", sideTwo[i]),
                {
                task: allTasks[i],
                completed: false,
                },
                { merge: true }
            );
        }
        
        week++;
        const lastTask = allTasks.pop();

        if (lastTask) {
            allTasks.unshift(lastTask);
        }
        
        else {
            throw new Error("Task creation failed: List unshift returned undefined");
        }

    }
};

export const getTasksForCollectiveWeek = async ( collective: string, week: number, year: number) => {
  const snap = await getDocs(
    collection(db, "collectives", collective, "years", year.toString(), "weeks", week.toString(), "tasks")
  );

  return snap.docs.map((d) => ({
    room: d.id,
    task: d.data()?.task ?? "",
    completed: !!d.data()?.completed,
  }));
};
