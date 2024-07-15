import HomeFeed from "@/components/HomeFeed";
import { Collections } from "@/lib/constants";
import { postToJSON } from "@/lib/firebase";
import { IPost } from "@/lib/post.model";
import {
  collectionGroup,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

// max posts to query per page
const LIMIT = 1;

async function getPosts() {
  const postsCollectionGroup = collectionGroup(
    getFirestore(),
    Collections.POSTS
  );
  const postsQuery = query(
    postsCollectionGroup,
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);
  return posts;
}

export default async function HomePage() {
  const initialPosts: IPost[] = await getPosts();

  return (
    <main>
      <HomeFeed initialPosts={initialPosts} />
    </main>
  );
}
