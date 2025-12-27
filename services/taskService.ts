import { auth, db } from "../utils/FirebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { numberOfWeeksInYear } from "bb-ts-datetime";
import { getRoomsInCollective } from "./generalService";

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
                doc(db, "collectives", collective, "weeks", week.toString(), "tasks", sideOne[i]),
                {
                task: allTasks[i],
                completed: false,
                },
                { merge: true }
            );
            await setDoc(
                doc(db, "collectives", collective, "weeks", week.toString(), "tasks", sideTwo[i]),
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
}