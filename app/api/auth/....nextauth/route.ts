import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";
import Barang from "@/models/alat";

export async function GET() {
  try {
    await dbConnect();
    const data = await Barang.find({});
    return NextResponse.json({ success: true, data: data });
  } catch (error) {
    console.error("DEBUG API GET ERROR:", error);
    return NextResponse.json({ success: false, error: "Database error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const newBarang = await Barang.create(body);
    return NextResponse.json({ success: true, data: newBarang }, { status: 201 });
  } catch (error) {
    console.error("DEBUG API POST ERROR:", error);
    return NextResponse.json({ success: false, error: "Gagal simpan" }, { status: 500 });
  }
}