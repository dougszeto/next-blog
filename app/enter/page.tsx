"use client";

import { UserContext } from "@/lib/context";
import { auth, signInPopup } from "@/lib/firebase";
import { useContext } from "react";
export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  // 1. user signed out <SignInButton />
  // 2. user signed in, but missing username <UsernameForm />
  // 3. user signed in, has username <SignOutButton />

  return (
    <main>
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

// Sign in with google button

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInPopup();
  };

  return (
    <button className="btn-google" onClick={signInWithGoogle}>
      <img src={"/google.png"} /> Sign in with Google
    </button>
  );
}
function SignOutButton() {
  return (
    <button className="btn" onClick={() => auth.signOut()}>
      Sign Out
    </button>
  );
}
function UsernameForm() {
  return <SignOutButton />;
}
