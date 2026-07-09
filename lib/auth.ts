import GoogleProvider from "next-auth/providers/google";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: { id: string; role: string } & DefaultSession["user"];
  }
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        // Ganti dengan email asli admin kamu
        token.role = user.email === "anovamaruf@gmail.com" ? "admin" : (user.role || "user");
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role || "user";
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};