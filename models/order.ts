import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
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

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);