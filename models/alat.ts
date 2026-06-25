// models/alat.ts
import mongoose from 'mongoose';

const AlatSchema = new mongoose.Schema({
  // pastikan field-nya sesuai dengan yang kamu kirim dari frontend
  nama: String,
  deskripsi: String,
  harga: Number,
  stok: Number
});

// Penting: gunakan mongoose.models.Alat agar tidak error saat di-hot reload
export default mongoose.models.Alat || mongoose.model('Alat', AlatSchema);