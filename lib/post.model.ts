import { Timestamp } from "firebase/firestore";

export interface IPost {
    content: string;
    coverPhoto: string; // URL to photo
    createdAt: number | Timestamp;
    heartCount: number;
    published: boolean;
    slug: string;
    title: string;
    uid: string;
    updatedAt: string;
    username: string;
}