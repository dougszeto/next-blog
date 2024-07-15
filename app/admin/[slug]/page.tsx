import { createMetadata } from "@/lib/metadata";
import { Metadata } from "next";

export const metadata: Metadata = createMetadata({ title: "Admin Page" });

export default function AdminPostEdit({}) {
  return <main>Edit Post</main>;
}
