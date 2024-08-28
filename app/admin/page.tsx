"use client";
import styles from "@styles/Admin.module.css";

import AuthCheck from "@/components/AuthCheck";
import PostFeed from "@/components/PostFeed";
import { AdminTabs, Collections, SortBy } from "@/lib/constants";
import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import { IPost } from "@/lib/post.model";
import {
  collection,
  CollectionReference,
  doc,
  DocumentData,
  getFirestore,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import kebabCase from "lodash.kebabcase";
import toast from "react-hot-toast";
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@/lib/material-tailwind";

export default function AdminPage({}) {
  const data = [
    {
      label: "Write a new post",
      value: AdminTabs.CREATE,
      renderContent: () => <CreateNewPost />,
    },
    {
      label: "View Posts",
      value: AdminTabs.VIEW,
      renderContent: () => <PostList />,
    },
  ];
  return (
    <main>
      <AuthCheck>
        <h1>Manage Your Posts</h1>

        <Tabs value={AdminTabs.CREATE}>
          <TabsHeader>
            {data.map(({ label, value }) => (
              <Tab key={value} value={value}>
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, renderContent }) => (
              <TabPanel key={value} value={value}>
                {renderContent()}
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState(SortBy.RECENT);
  const [filter, setFilter] = useState("all");

  const generateOrderBy = (sortBy: SortBy) => {
    switch (sortBy) {
      case SortBy.HEARTS:
        return orderBy("heartCount", "desc");
      case SortBy.OLDEST:
        return orderBy("updatedAt", "asc");
      default:
        return orderBy("updatedAt", "desc");
    }
  };

  const generateWhereClause = (filter: string) => {
    switch (filter) {
      case "published":
        return where("published", "==", true);
      case "unpublished":
        return where("published", "==", false);
      default:
        return;
    }
  };

  const generateQuery = (
    ref: CollectionReference<DocumentData, DocumentData>,
    sortBy: SortBy,
    filterBy: string
  ) => {
    const order = generateOrderBy(sortBy);

    const whereClause = generateWhereClause(filterBy);

    if (whereClause){
      return query(ref, whereClause, order);
    } 
    return query(ref, order);
  };
  
  const ref = collection(
    getFirestore(),
    Collections.USERS,
    auth.currentUser?.uid || "",
    Collections.POSTS
  );
  const postQuery = generateQuery(ref, sort, filter);

  const [querySnapshot] = useCollection(postQuery);
  const posts = (querySnapshot?.docs.map((doc) => doc.data()) ?? []) as IPost[];
  
  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm)
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleChangeSort = (event: ChangeEvent<HTMLSelectElement>) => {
    setSort(Number(event.target.value));
  };

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };
  return (
    <>
      <input
        type="text"
        placeholder="search for an article"
        onChange={handleSearch}
      />
      <span>Sort by:&nbsp;</span>
      <select value={sort} onChange={handleChangeSort}>
        <option value={SortBy.RECENT}>Most Recent</option>
        <option value={SortBy.HEARTS}>Popular</option>
        <option value={SortBy.OLDEST}>Oldest</option>
      </select>
      <div className="flex flex-row">
        <span>Show:&nbsp;</span>
        <div className="flex flex-row mr-4">
          <input
            type="radio"
            id="all"
            value="all"
            name="filter"
            checked={filter === "all"}
            onChange={handleFilterChange}
          />
          &nbsp;
          <label htmlFor="all">all</label>
        </div>
        <div className="flex flex-row mr-4">
          <input
            type="radio"
            id="published"
            value="published"
            name="filter"
            checked={filter === "published"}
            onChange={handleFilterChange}
          />
          &nbsp;
          <label htmlFor="published">published</label>
        </div>
        <div className="flex flex-row mr-4">
          <input
            type="radio"
            id="unpublished"
            value="unpublished"
            name="filter"
            checked={filter === "unpublished"}
            onChange={handleFilterChange}
          />
          &nbsp;
          <label htmlFor="unpublished">unpublished</label>
        </div>
      </div>

      <PostFeed posts={filteredPosts} admin />
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
