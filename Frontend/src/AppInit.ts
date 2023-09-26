import { initializeFirebaseAsync } from "./firebase/firebase";

export const initializeApp = async () => {
    await initializeFirebaseAsync();
};
