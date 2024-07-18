"use client";
import { UserContext } from "@/lib/context";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export default function Navbar({}) {
  const { user, username, isAdmin } = useContext(UserContext);

  const router = useRouter();
  const signOutNow = () => {
    signOut(auth);
    router.refresh();
  };
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link href="/">
            <button className="btn-logo">FEED</button>
          </Link>
        </li>
        {/* user is signed in and has username */}
        {username && (
          <>
            <li className="push-left">
              <button onClick={signOutNow}>Sign Out</button>
            </li>
            <li>
              {isAdmin && (
                <Link href="/admin">
                  <button className="btn-blue">Write Posts</button>
                </Link>
              )}
            </li>
            <li>
              <Link href={`/${username}`}>
                <img src={user?.photoURL} />
              </Link>
            </li>
          </>
        )}
        {/* user is not signed in OR has not created username */}
        {!username && (
          <li>
            <Link href="/enter">
              <button className="btn-blue">Log in</button>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
