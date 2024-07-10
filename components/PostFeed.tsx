import { IPost } from "@/lib/post.model";
import Link from "next/link";

interface PostFeedProps {
  admin?: boolean;
  posts: Array<IPost>;
}

export default function PostFeed({ posts, admin = false }: PostFeedProps) {
  return posts ? (
    posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />)
  ) : (
    <></>
  );
}

interface PostItemProps {
  admin: boolean;
  post: IPost;
}

function PostItem({ post, admin = false }: PostItemProps) {
  // Estimate word count and read time
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);
  return (
    <div className="card">
      <Link href={`/${post.username}`}>
        <strong>By @{post.username}</strong>
      </Link>
      <Link href={`/${post.username}/${post.slug}`}>
        <h2>{post.title}</h2>
      </Link>
      <footer>
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="push-left">❤️ {post.heartCount} hearts</span>
      </footer>
    </div>
  );
}
