"use client";
import styles from "@styles/Admin.module.css";

import AuthCheck from "@/components/AuthCheck";
import PostFeed from "@/components/PostFeed";
import { Collections } from "@/lib/constants";
import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import { IPost } from "@/lib/post.model";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FormEvent, useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";

export default function AdminPage({}) {
  return (
    <main>
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const ref = collection(
    getFirestore(),
    Collections.USERS,
    auth.currentUser?.uid || "",
    Collections.POSTS
  );
  const postQuery = query(ref, orderBy("createdAt"));

  const [querySnapshot] = useCollection(postQuery);
  const posts = querySnapshot?.docs.map((doc) => doc.data()) as IPost[];

  return (
    <>
      <h1>Manage Your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  // ensures that slug is URL safe (strips ?!/ chars)
  const slug = encodeURI(kebabCase(title));

  const isValid = title.length > 3 && title.length < 100;

  const createPost = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uid = auth.currentUser?.uid ?? "";
    const ref = doc(
      getFirestore(),
      Collections.USERS,
      uid,
      Collections.POSTS,
      slug
    );

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);
    toast.success("Post created!");

    // navigate to edit page after creation
    router.push(`/admin/${slug}`);
  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
        className={styles.input}
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
