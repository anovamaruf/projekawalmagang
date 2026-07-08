import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    // Memastikan hanya user yang punya token (login) yang bisa akses
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/login", // Arahkan ke halaman login jika belum auth
  },
});

// Menambahkan matcher agar halaman order juga terlindungi
export const config = { 
  matcher: ["/admin/:path*", "/admin/order/:path*"] 
};