import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from '@/lib/mongodb';
import Order from '@/models/order';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    
    const newOrder = await Order.create({
      customerName: body.namaPenyewa, 
      nomorHp: body.nomorHp,
      tanggalSewa: body.tanggalSewa,
      durasiSewa: body.durasiSewa,
      opsiPengambilan: body.opsiPengambilan,
      alamatLengkap: body.alamatLengkap,
      items: body.items,
      totalPrice: body.totalPrice,
      status: 'Pending',
      userId: session.user?.email
    });
    
    return NextResponse.json({ success: true, data: newOrder });
  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}