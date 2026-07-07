import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/order';

export async function GET() {
  try {
    await dbConnect();
    // Mengambil semua order, urutkan dari yang terbaru
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal ambil data" }, { status: 500 });
  }
}