// backend/routes/cartRoutes.js
import express from 'express';
import Cart from '../models/Cart.js';

const router = express.Router();

// Add to cart
router.post('/', async (req, res) => {
  try {
    const userId = req.session?.user?.id; // 👈 Use session user
    const { productId, name, price, image } = req.body;

    if (!userId || !productId || !name) {
      return res.status(400).json({ error: 'Missing user or product details' });
    }

    const existingItem = await Cart.findOne({ userId, productId });

    if (existingItem) {
      return res.status(200).json({ message: 'Product already in cart' });
    }

    const newItem = new Cart({ userId, productId, name, price, image });
    await newItem.save();

    res.status(201).json({ message: 'Item added to cart', item: newItem });
  } catch (err) {
    console.error('Cart add error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all cart items for logged-in user
router.get('/', async (req, res) => {
  try {
    const userId = req.session?.user?.id; // 👈 Get user ID from session
    if (!userId) return res.status(401).json({ message: 'Not logged in' });

    const items = await Cart.find({ userId });
    res.json(items);
  } catch (err) {
    console.error('Fetch cart error:', err);
    res.status(500).json({ error: 'Failed to fetch cart items' });
  }
});

// Optional: Delete cart item
router.delete('/:productId', async (req, res) => {
  try {
    const userId = req.session?.user?.id;
    const { productId } = req.params;

    await Cart.deleteOne({ userId, productId });
    res.status(200).json({ message: 'Item removed' });
  } catch (err) {
    console.error('Delete cart error:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

export default router;
