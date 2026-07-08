import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from '@/lib/mongodb';
import Order from '@/models/order';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    
    // GANTI EMAIL INI dengan email admin yang kamu gunakan untuk login
    const adminEmail = "anovamaruf@gmail.com"; 
    
    // Logika: Jika admin, ambil semua order. Jika user biasa, filter berdasarkan userId-nya.
    const query = session.user?.email === adminEmail ? {} : { userId: session.user?.email };
    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders || [] });
  } catch (error) {
    console.error("Order API Error:", error);
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const newOrder = await Order.create({
      ...body,
      userId: session.user?.email,
      createdAt: new Date()
    });

    return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
  } catch (error) {
    console.error("Order Creation Error:", error);
    return NextResponse.json({ success: false, error: "Gagal membuat order" }, { status: 500 });
  }
}