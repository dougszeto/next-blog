"use client";
import { IPost } from "@/lib/post.model";
import { doc, getFirestore } from "firebase/firestore";
import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";
import ReactMarkdown from "react-markdown";

interface PostContentProps {
  initialPost: IPost;
  path: string;
}

export default function PostContent({ initialPost, path }: PostContentProps) {
  const postRef = doc(getFirestore(), path);
  const [realtimePost] = useDocumentData(postRef);

  const post = (realtimePost as IPost) || initialPost;
  console.log("🚀 ~ PostContent ~ post:", post);

  const createdAt: Date =
    typeof post.createdAt === "number"
      ? new Date(post.createdAt)
      : post?.createdAt?.toDate();

  return (
    <div className="card">
      <h1>{post.title}</h1>
      <span className="text-sm">
        Written by&nbsp;
        <Link href={`/${post.username}`}>@{post.username}</Link>
        &nbsp;on {createdAt?.toISOString()}
      </span>
      <ReactMarkdown>{post.content}</ReactMarkdown>
    </div>
  );
}
