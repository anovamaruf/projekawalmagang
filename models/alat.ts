import mongoose from 'mongoose';
const AlatSchema = new mongoose.Schema({
  name: String,
  category: String,
  pricePerDay: Number,
  stock: Number,
  image: String
});
export default mongoose.models.Alat || mongoose.model('Alat', AlatSchema);