import dbConnect from "@/lib/mongodb";
import Alat from "@/models/alat";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect(); // Panggil fungsi koneksi
    const data = await Alat.find({});
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect(); // Panggil fungsi koneksi
    const body = await req.json();
    const newAlat = await Alat.create(body);
    return NextResponse.json({ success: true, data: newAlat }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}