import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// 1. Ekspor authOptions agar bisa dipakai di API route lain (seperti /api/orders/route.ts)
export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

// 2. Handler untuk NextAuth
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };