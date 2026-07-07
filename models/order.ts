import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerName: String,
  nomorHp: String,
  tanggalSewa: String,
  durasiSewa: Number,
  opsiPengambilan: String,
  alamatLengkap: String,
  items: Array,
  totalPrice: Number,
  status: String,
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);