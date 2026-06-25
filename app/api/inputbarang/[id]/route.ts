import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import alat from '@/models/alat';

// 1. API UNTUK MENGUBAH DATA BARANG (PUT)
export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    // Ambil data JSON yang dikirim oleh Frontend form admin
    const body = await request.json();
    
    // Tunggu nilai params id nya selesai dibaca
    const { id } = await params; 

    // Update data ke MongoDB berdasarkan ID
    const updatedEquipment = await alat.findByIdAndUpdate(
      id, 
      {
        name: body.name,
        category: body.category,
        pricePerDay: Number(body.pricePerDay),
        stock: Number(body.stock),
        image: body.image
      }, 
      { new: true, runValidators: true } // Mengembalikan data yang baru diupdate
    );
    
    if (!updatedEquipment) {
      return NextResponse.json({ success: false, message: 'Barang tidak ditemukan di database' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedEquipment }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// 2. API UNTUK MENGHAPUS BARANG (DELETE)
export async function DELETE(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const { id } = await params; 

    const deletedEquipment = await alat.findByIdAndDelete(id);

    if (!deletedEquipment) {
      return NextResponse.json({ success: false, message: 'Barang tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Barang berhasil dihapus' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}