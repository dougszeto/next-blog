"use client";

import { UserContext } from "@/lib/context";
import { auth, signInPopup } from "@/lib/firebase";
import { doc, getDoc, getFirestore, writeBatch } from "firebase/firestore";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import debounce from "lodash.debounce";
import { Collections } from "@/lib/constants";
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
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setIsLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  // Hit the database for username match after each debounced change
  // useCallback needed to memoize function between re-renders and allow debouncing
  const checkUsername = useCallback(
    debounce(async (value: string) => {
      if (value.length >= 3) {
        const ref = doc(getFirestore(), Collections.USERNAMES, value);
        const snap = await getDoc(ref);

        setIsValid(!snap.exists());
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setIsLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setIsLoading(true);
      setIsValid(false);
    }
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Create refs for both documents
    const userDoc = doc(getFirestore(), Collections.USERS, user.uid);
    const usernameDoc = doc(getFirestore(), Collections.USERNAMES, formValue);

    // batch write both docs
    const batch = writeBatch(getFirestore());
    batch.set(userDoc, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameDoc, { uid: user.uid });

    await batch.commit();
  };

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>

          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            UsernameValid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({
  username,
  isValid,
  loading,
}: {
  username: string | null;
  isValid: boolean;
  loading: boolean;
}) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-success">{username} is available!</p>;
  } else if (username && !isValid) {
    return <p className="text-danger">{username} is taken!</p>;
  } else {
    return <p></p>;
  }
}
