"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950 text-white">
      <div className="p-8 bg-neutral-900 rounded-xl shadow-lg border border-neutral-800 text-center">
        <h1 className="text-2xl font-bold mb-2">Selamat Datang di Fynoo</h1>
        <p className="text-neutral-400 mb-8">Silakan masuk menggunakan akun Google Anda</p>
        
        <button
          onClick={() => signIn("google", { callbackUrl: "/katalog" })}
          className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition duration-200"
        >
          Login dengan Google
        </button>
      </div>
    </div>
  );
}