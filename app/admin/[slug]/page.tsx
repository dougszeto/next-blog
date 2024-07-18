"use client";

import styles from "@styles/Admin.module.css";
import AuthCheck from "@/components/AuthCheck";
import { Collections } from "@/lib/constants";
import { auth } from "@/lib/firebase";
import { IPost } from "@/lib/post.model";
import {
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import Link from "next/link";
import ImageUploader from "@/components/ImageUploader";

interface AdminPostEditProps {
  params: { slug: string };
}
export default function AdminPostEdit({ params }: AdminPostEditProps) {
  return (
    <AuthCheck>
      <PostManager slug={params.slug} />
    </AuthCheck>
  );
}

function PostManager({ slug }: { slug: string }) {
  const [isPreview, setIsPreview] = useState(false);
  const postRef = doc(
    getFirestore(),
    Collections.USERS,
    auth.currentUser?.uid ?? "",
    Collections.POSTS,
    slug
  );

  const [rawPost] = useDocumentDataOnce(postRef);
  const post = rawPost as IPost;

  return (
    <main className={styles.container}>
      {post && (
        <>
          <section>
            <h1>{post?.title}</h1>
            <p>ID: {post?.slug}</p>

            <PostForm
              postRef={postRef}
              defaultValues={post}
              isPreview={isPreview}
            />
          </section>
          <aside>
            <h3>Tools</h3>
            <button
              onClick={() => {
                setIsPreview(!isPreview);
              }}
            >
              {isPreview ? "Edit" : "Preview"}
            </button>
            <Link
              className={styles.flex}
              href={`/${post?.username}/${post?.slug}`}
            >
              <button className={`btn-blue ${styles.grow}`}>Live view</button>
            </Link>
          </aside>
        </>
      )}
    </main>
  );
}

interface PostFormProps {
  defaultValues: IPost;
  isPreview: boolean;
  postRef: DocumentReference<DocumentData, DocumentData>;
}
function PostForm({ postRef, defaultValues, isPreview }: PostFormProps) {
  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const { isValid, isDirty, errors } = formState;

  const updatePost = async ({
    content,
    published,
  }: {
    content: string;
    published: boolean;
  }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });
    reset({ content, published });
    toast.success("Post updated successfully!");
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {isPreview && (
        <div className="card">
          <ReactMarkdown>{watch("content")}</ReactMarkdown>
        </div>
      )}
      <div className={isPreview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          {...register("content", {
            maxLength: { value: 20000, message: "Content is too long" },
            minLength: { value: 10, message: "Content is too short" },
            required: { value: true, message: "Content is required" },
          })}
        />
        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <input
            {...register("published")}
            className={styles.checkbox}
            type="checkbox"
          />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
