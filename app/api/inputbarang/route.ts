import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import alat from '@/models/alat';
import cloudinary from '@/lib/cloudinary';

export async function GET() {
  try {
    await dbConnect();
    const data = await alat.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const dataInput = await request.json();

    // Simpan data barang baru ke MongoDB beserta URL gambar Cloudinary
    const barangBaru = await alat.create({
      name: dataInput.name,
      category: dataInput.category,
      pricePerDay: Number(dataInput.pricePerDay),
      stock: Number(dataInput.stock),
      image: dataInput.image
    });

    return NextResponse.json({ success: true, data: barangBaru }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}