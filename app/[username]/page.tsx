import PostFeed from "@/components/PostFeed";
import UserProfile from "@/components/UserProfile";
import { getUserWithUsername, postToJSON } from "@/lib/firebase";
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

interface UserProfilePageProps {
  user: IUser | null;
  posts: Array<IPost>;
}

export async function getUserProfileData(
  username: string
): Promise<UserProfilePageProps> {
  const userDoc = await getUserWithUsername(username);

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
export default async function UserProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { user, posts } = await getUserProfileData(params.username);
  return (
    <main>
      <UserProfile user={user} />
      <PostFeed posts={posts} />
    </main>
  );
}
