import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IEquipment extends Document {
  name: string;
  category: string; // Contoh: Tenda, Carrier, Sepatu, Sleeping Bag, Alat Masak
  pricePerDay: number;
  stock: number;
  image: string; // URL gambar dari Cloudinary nanti
  isAvailable: boolean;
  createdAt: Date;
}

const EquipmentSchema: Schema = new Schema({
  name: { type: String, required: [true, 'Nama alat harus diisi'] },
  category: { type: String, required: [true, 'Kategori alat harus diisi'] },
  pricePerDay: { type: Number, required: [true, 'Harga sewa per hari harus diisi'] },
  stock: { type: Number, required: [true, 'Jumlah stok harus diisi'], default: 1 },
  image: { type: String, required: [true, 'Gambar alat harus diupload'] },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

// Mencegah compile ulang model saat Next.js melakukan hot-reload (Turbopack)
const Equipment = models.Equipment || model<IEquipment>('Equipment', EquipmentSchema);

export default Equipment;