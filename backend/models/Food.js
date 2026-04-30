import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  quantity: { type: String, required: true },
  location: { type: String },
  hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelName: { type: String, required: true },
  status: { type: String, enum: ['available', 'accepted'], default: 'available' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Food = mongoose.model('Food', foodSchema);
