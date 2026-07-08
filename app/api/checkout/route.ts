import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/order';

export async function POST(request: Request) {
  try {
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
      status: 'Pending'
    });
    
    return NextResponse.json({ success: true, data: newOrder });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}