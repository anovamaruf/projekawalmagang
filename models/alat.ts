import mongoose from 'mongoose';

const AlatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  image: { type: String, required: false }
});

export default mongoose.models.Alat || mongoose.model('Alat', AlatSchema);