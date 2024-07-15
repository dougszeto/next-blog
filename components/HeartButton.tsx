"use client";
import { Collections } from "@/lib/constants";
import { auth } from "@/lib/firebase";
import {
  doc,
  DocumentReference,
  getFirestore,
  increment,
  writeBatch,
} from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";

interface HeartButtonProps {
  postPath: string;
}
export default function HeartButton({ postPath }: HeartButtonProps) {
  const postRef = doc(getFirestore(), postPath);
  const heartRef = doc(
    getFirestore(),
    postPath,
    Collections.HEARTS,
    auth.currentUser?.uid ?? ""
  );

  const [heartDoc] = useDocument(heartRef);

  const addHeart = async () => {
    const uid = auth.currentUser?.uid ?? "";
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  const removeHeart = async () => {
    const batch = writeBatch(getFirestore());

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  return heartDoc?.exists() ? (
    <button onClick={removeHeart}>💔 Unheart</button>
  ) : (
    <button onClick={addHeart}>❤️ Heart</button>
  );
}
