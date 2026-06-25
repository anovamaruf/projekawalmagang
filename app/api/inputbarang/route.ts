// app/api/inputbarang/route.ts
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

// Pastikan kamu mengekspor fungsi POST
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    // ... logika simpan datamu di sini ...
    return NextResponse.json({ message: "Berhasil" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Gagal" }, { status: 500 });
  }
}