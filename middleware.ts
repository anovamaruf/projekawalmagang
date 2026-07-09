import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const path = req.nextUrl.pathname;

    // 1. Biarkan publik akses halaman utama (Home) dan Katalog
    if (path === "/" || path === "/katalog") {
      return NextResponse.next();
    }

    // 2. Jika coba akses /admin tapi bukan admin, lempar ke /
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => true, // Middleware menangani logika akses secara manual
    },
  }
);

// Hapus bagian `matcher` jika ada, agar logika di atas yang mengambil alih sepenuhnya