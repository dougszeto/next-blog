"use client";
import { IPost } from "@/lib/post.model";
import { doc, getFirestore } from "firebase/firestore";
import Link from "next/link";
import { useDocumentData } from "react-firebase-hooks/firestore";
import AuthCheck from "./AuthCheck";
import HeartButton from "./HeartButton";

interface PostSideContentProps {
  initialPost: IPost;
  path: string;
}

export default function PostContent({
  initialPost,
  path,
}: PostSideContentProps) {
  const postRef = doc(getFirestore(), path);
  const [realtimePost] = useDocumentData(postRef);

  const post = (realtimePost as IPost) || initialPost;
  console.log("🚀 ~ post:", post);

  return (
    <>
      <p>
        <strong>{post.heartCount || 0} ❤️</strong>
      </p>
      <AuthCheck
        fallback={
          <Link href="/enter">
            <button>❤️ Sign Up</button>
          </Link>
        }
      >
        <HeartButton postPath={path} />
      </AuthCheck>
    </>
  );
}
