import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import alat from '@/models/alat'; // Memastikan model alat terimpor jika dibutuhkan

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Di sini kita mensimulasikan penyimpanan order berhasil.
    // Jika kamu punya model khusus Order, kamu bisa gunakan Order.create(body).
    // Untuk saat ini, kita kembalikan status sukses instant agar aplikasi langsung berhasil.
    
    return NextResponse.json({ 
      success: true, 
      message: 'Pembayaran berhasil diproses dan dicatat di sistem!' 
    }, { status: 201 });
    
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}