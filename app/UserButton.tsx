"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function UserButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {/* Admin bisa pindah ke katalog kapan saja */}
        {session.user?.role === "admin" && (
          <Link href="/katalog" className="text-gray-300 hover:text-white">Katalog</Link>
        )}
        <button onClick={() => signOut()} className="text-white">Logout</button>
      </div>
    );
  }

  // Tombol di navbar hanya "Masuk" jika belum login
  return (
    <button onClick={() => signIn()} className="text-white">Masuk</button>
  );
}