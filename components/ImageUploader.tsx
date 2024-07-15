"use client";
import { ChangeEvent, useState } from "react";
import Loader from "./Loader";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { auth, STATE_CHANGED, storage } from "@/lib/firebase";

export default function ImageUploader({}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files ?? [])[0];
    const extension = file?.type.split("/")[1];

    // Create reference to storage bucket location
    const fileRef = ref(
      storage,
      `uploads/${auth.currentUser?.uid}/${Date.now()}.${extension}`
    );

    // begin upload
    setUploading(true);
    const task = uploadBytesResumable(fileRef, file);

    // Listen to updates on upload task
    task.on(STATE_CHANGED, (snapshot) => {
      const percent = (
        (snapshot.bytesTransferred / snapshot.totalBytes) *
        100
      ).toFixed(0);

      setProgress(Number(percent));
    });

    // Get downloadURL after task resolves (not a native promise)
    task.then(() =>
      getDownloadURL(fileRef).then((url: string) => {
        setDownloadURL(url);
        setUploading(false);
      })
    );
  };
  return (
    <div>
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Image
            <input
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className="upload-snippet">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
}
