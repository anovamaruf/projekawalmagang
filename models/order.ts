import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  customerName: String,
  items: Array,
  totalPrice: Number,
  durasi: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);