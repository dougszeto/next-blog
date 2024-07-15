"use client";

import { UserContext } from "@/lib/context";
import Link from "next/link";
import React, { useContext } from "react";

interface AuthCheckProps {
  /**
   * content to show when user is authenticated
   */
  children: React.ReactNode;
  /**
   * fallback content to show when user is not authenticated
   * @default Link to sign in page
   */
  fallback?: React.ReactNode;
}
export default function AuthCheck({ children, fallback }: AuthCheckProps) {
  const { username } = useContext(UserContext);
  return username
    ? children
    : fallback ?? <Link href="/enter">You must be signed in</Link>;
}
