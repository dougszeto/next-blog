import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { Collections } from "./constants";

export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkIsAdmin = async (userId: string) => {
    const adminDoc = await getDoc(
      doc(getFirestore(), Collections.ADMINS, userId)
    );
    if (adminDoc.exists()) setIsAdmin(true);
    else setIsAdmin(false);
  };

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      checkIsAdmin(user.uid);
      const ref = doc(getFirestore(), Collections.USERS, user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, isAdmin };
}
