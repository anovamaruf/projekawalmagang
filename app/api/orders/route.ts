import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/order';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    // JANGAN PERNAH membiarkan API tidak mengirim apa-apa
    return NextResponse.json({ success: true, data: orders || [] });
  } catch (error) {
    // Jika error, kirim respon JSON kosong agar tidak crash
    return NextResponse.json({ success: false, data: [] });
  }
}