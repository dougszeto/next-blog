import styles from "@styles/Post.module.css";
import PostContent from "@/components/PostContent";
import PostSideContent from "@/components/PostSideContent";
import { Collections } from "@/lib/constants";
import { getUserWithUsername, postToJSON } from "@/lib/firebase";
import { IPost } from "@/lib/post.model";
import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
} from "firebase/firestore";

export async function getPost(
  username: string,
  slug: string
): Promise<{ post: IPost; path: string }> {
  const userDoc = await getUserWithUsername(username);

  let post;
  let path = "";

  if (userDoc) {
    const postRef = doc(
      getFirestore(),
      userDoc.ref.path,
      Collections.POSTS,
      slug
    );

    post = postToJSON(await getDoc(postRef));
    path = postRef.path;
  }

  return { post, path };
}

export async function generateStaticParams() {
  const q = query(
    collectionGroup(getFirestore(), Collections.POSTS),
    limit(20)
  );

  const snapshot = await getDocs(q);
  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return { params: { username, slug } };
  });

  return paths;
}
interface PostPageProps {
  params: {
    username: string;
    slug: string;
  };
}

export const revalidate = 5;
export default async function PostPage(props: PostPageProps) {
  const { username, slug } = props.params;
  const { post, path } = await getPost(username, slug);

  return (
    <main className={styles.container}>
      <section>
        <PostContent initialPost={post} path={path} />
      </section>
      <aside className="card">
        <PostSideContent initialPost={post} path={path} />
      </aside>
    </main>
  );
}
