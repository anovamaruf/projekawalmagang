import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import alat from '@/models/alat';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = await params;
    const { action, jumlah } = body;

    const currentAlat = await alat.findById(id);
    if (!currentAlat) {
      return NextResponse.json({ success: false, message: 'Barang tidak ditemukan' }, { status: 404 });
    }

    let newStock = currentAlat.stock;
    if (action === 'KURANGI') {
      newStock = currentAlat.stock - jumlah;
    } else if (action === 'TAMBAH') {
      newStock = currentAlat.stock + jumlah;
    }

    const updatedEquipment = await alat.findByIdAndUpdate(
      id,
      { stock: newStock },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedEquipment }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = await params; 

    const updatedEquipment = await alat.findByIdAndUpdate(
      id, 
      {
        name: body.name,
        category: body.category,
        pricePerDay: Number(body.pricePerDay),
        stock: Number(body.stock),
        image: body.image
      }, 
      { new: true, runValidators: true }
    );
    
    if (!updatedEquipment) {
      return NextResponse.json({ success: false, message: 'Barang tidak ditemukan di database' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedEquipment }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

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