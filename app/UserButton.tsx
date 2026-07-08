"use client";
import { signIn, signOut, useSession } from "next-auth/react";

export default function UserButton() {
  const { data: session } = useSession();
  if (session) return <button onClick={() => signOut()}>Logout</button>;
  return <button onClick={() => signIn()}>Login</button>;
}