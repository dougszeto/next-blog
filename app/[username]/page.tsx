import PostFeed from "@/components/PostFeed";
import UserProfile from "@/components/UserProfile";
import { getUserWithUsername, postToJSON } from "@/lib/firebase";
import { createMetadata } from "@/lib/metadata";
import { IPost } from "@/lib/post.model";
import { IUser } from "@/lib/user.model";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { notFound } from "next/navigation";

interface UserProfilePageData {
  user: IUser | null;
  posts: Array<IPost>;
}

interface UserProfilePageProps {
  params: { username: string };
}

async function getUserProfileData(
  username: string
): Promise<UserProfilePageData> {
  const userDoc = await getUserWithUsername(username);

  if (!userDoc) notFound();
  // JSON serializable data
  let user = null;
  let posts: Array<IPost> = [];

  if (userDoc) {
    user = userDoc.data() as IUser;
    const postsRef = collection(userDoc.ref, "posts");
    const postsQuery = query(
      postsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    posts = ((await getDocs(postsQuery)).docs.map(postToJSON) ??
      []) as Array<IPost>;
  }
  return { user, posts };
}

export async function generateMetadata(props: UserProfilePageProps) {
  const { user } = await getUserProfileData(props.params.username);

  return createMetadata({
    title: props.params.username,
    description: `View ${props.params.username}'s profile on dougsgrubs`,
    image: user?.photoURL
  });
}

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { user, posts } = await getUserProfileData(params.username);
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
