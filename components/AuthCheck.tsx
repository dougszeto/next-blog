"use client";

import NotFound from "@/app/not-found";
import { UserContext } from "@/lib/context";
import Link from "next/link";
import React, { useContext } from "react";

interface AuthCheckProps {
  /**
   * Adds check to see if user is an authenticated admin
   * @default false
   */
  adminOnly?: boolean;
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
export default function AuthCheck({ adminOnly = false, children, fallback }: AuthCheckProps) {
  const { username, isAdmin } = useContext(UserContext);
  if (adminOnly) return username && isAdmin ? children : fallback ?? <NotFound />
  return username
    ? children
    : fallback ?? <Link href="/enter">You must be signed in</Link>;
}
