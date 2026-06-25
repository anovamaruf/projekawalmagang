import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Mengambil konfigurasi dari file auth.ts kamu

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };