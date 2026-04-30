import express from 'express';
import mongoose from 'mongoose';
import { Food } from '../models/Food.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import { User } from '../models/User.js';

const router = express.Router();

// Add Food (Hotel only)
router.post('/add-food', authenticate, authorize(['Hotel']), async (req, res) => {
  try {
    const { foodName, quantity, location } = req.body;
    const hotelId = req.user?.id;
    
    if (!hotelId) return res.status(401).json({ message: 'Unauthorized' });

    const hotel = await User.findById(hotelId);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

    const food = new Food({
      foodName,
      quantity,
      location,
      hotelId,
      hotelName: hotel.name,
      status: 'available'
    });

    await food.save();
    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// All Food (NGO only)
router.get('/all-food', authenticate, authorize(['NGO']), async (req, res) => {
  try {
    const foods = await Food.find({ status: 'available' });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// My Food (Hotel only)
router.get('/my-food', authenticate, authorize(['Hotel']), async (req, res) => {
  try {
    const foods = await Food.find({ hotelId: req.user?.id });
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Accept Food (NGO only)
router.post('/accept-food/:id', authenticate, authorize(['NGO']), async (req, res) => {
  try {
    const foodId = req.params.id;
    const ngoId = req.user?.id;

    if (!ngoId) return res.status(401).json({ message: 'Unauthorized' });

    const food = await Food.findById(foodId);
    if (!food) return res.status(404).json({ message: 'Food item not found' });
    if (food.status === 'accepted') return res.status(400).json({ message: 'Food already accepted' });

    food.status = 'accepted';
    food.acceptedBy = new mongoose.Types.ObjectId(ngoId);
    await food.save();

    res.json({ message: 'Food accepted successfully', food });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
