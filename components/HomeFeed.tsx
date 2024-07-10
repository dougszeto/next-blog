"use client";

import { IPost } from "@/lib/post.model";
import {
  Timestamp,
  query,
  collectionGroup,
  getFirestore,
  where,
  orderBy,
  startAfter,
  limit,
  getDocs,
} from "firebase/firestore";
import { useState } from "react";
import Loader from "./Loader";
import PostFeed from "./PostFeed";
import { Collections } from "@/lib/constants";

// max posts to query per page
const LIMIT = 1;

interface HomeProps {
  initialPosts: IPost[];
}
export default function HomeFeed({ initialPosts }: HomeProps) {
  console.log("🚀 ~ HomeFeed ~ initialPosts:", initialPosts);
  const [posts, setPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const lastPost = posts[posts.length - 1];

    const cursor =
      typeof lastPost.createdAt === "number"
        ? Timestamp.fromMillis(lastPost.createdAt)
        : lastPost.createdAt;

    const q = query(
      collectionGroup(getFirestore(), Collections.POSTS),
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts: IPost[] = (await getDocs(q)).docs.map((doc) =>
      doc.data()
    ) as IPost[];

    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) setPostsEnd(true);
  };
  return (
    <main>
      <PostFeed posts={posts} />
      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load more</button>
      )}
      <Loader show={loading} />
      {postsEnd && "You have reached the end!"}
    </main>
  );
}
