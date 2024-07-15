import { getApp, initializeApp } from "firebase/app";
import 'firebase/auth';
import { getAuth, GoogleAuthProvider, signInWithPopup} from "firebase/auth";
import 'firebase/firestore';
import { DocumentData, QueryDocumentSnapshot, collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore";
import 'firebase/storage';
import { getStorage } from "firebase/storage";
import { Collections } from "./constants";


const firebaseConfig = {
    apiKey: "AIzaSyDsBxOxdFH5yQx9AyppWMXedKS40mCxe2g",
    authDomain: "nextfire-5f873.firebaseapp.com",
    projectId: "nextfire-5f873",
    storageBucket: "nextfire-5f873.appspot.com",
    messagingSenderId: "343121578459",
    appId: "1:343121578459:web:452b2aee7021456ccb7ffe",
    measurementId: "G-H42VNCNFD0"
};

function createFirebaseApp() {
    try {
        return getApp()
    } catch {
        return initializeApp(firebaseConfig)
    }
}

const firebaseApp = createFirebaseApp();

// Auth exports
export const auth = getAuth(firebaseApp);
export const googleAuthProvider = new GoogleAuthProvider();
export const signInPopup = () => {
    signInWithPopup(auth, googleAuthProvider)
}

// Firestore exports
export const firestore = getFirestore(firebaseApp);

// Storage exports
export const storage = getStorage(firebaseApp);
export const STATE_CHANGED = 'state_changed';


// Helper Functions
/**
 * Retrieves a user by username
 * @param username 
 * @returns QueryDocumentSnapshot
 */
export async function getUserWithUsername(username: string): Promise<QueryDocumentSnapshot<DocumentData, DocumentData>> {
    const collectionRef = collection(getFirestore(), Collections.USERS);
    const q = query(collectionRef, where('username', '==', username), limit(1));

    const userDoc = (await getDocs(q)).docs[0];
    return userDoc;
}

/**
 * Converts a firestore document to JSON
 * @param doc 
 */
export function postToJSON(doc: any): any {
    const data = doc.data();
    return {
        ...data,
        createdAt: data?.createdAt.toMillis(),
        updatedAt: data?.updatedAt.toMillis()
    }
}