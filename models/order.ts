import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  // Tambahkan field userId agar terhubung dengan akun user yang login
  userId: { type: String, required: true }, 
  
  customerName: String,
  namaPenyewa: String, 
  nomorHp: String,
  tanggalSewa: String,
  durasiSewa: Number,
  opsiPengambilan: String,
  alamatLengkap: String,
  items: Array,
  totalPrice: Number,
  status: { type: String, default: 'Pending' }, 
}, { timestamps: true });

// Gunakan pengecekan model agar tidak error saat hot-reload
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;