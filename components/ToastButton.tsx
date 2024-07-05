"use client";

import toast from "react-hot-toast";

export default function ToastButton({}) {
  return (
    <button
      onClick={() => {
        toast.success("Success!");
      }}
    >
      Toast Me!
    </button>
  );
}
