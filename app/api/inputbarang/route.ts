import connectMongoDB from "@/lib/mongodb";
import Alat from "@/models/alat";
import { NextResponse } from "next/server";

export async function GET() {
  await connectMongoDB();
  const data = await Alat.find({});
  return NextResponse.json({ success: true, data });
}

export async function POST(req: Request) {
  await connectMongoDB();
  const body = await req.json();
  const newAlat = await Alat.create(body);
  return NextResponse.json({ success: true, data: newAlat });
}