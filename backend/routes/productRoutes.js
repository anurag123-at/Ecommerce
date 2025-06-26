// backend/routes/productRoutes.js
import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});



router.post('/', async (req, res) => {
  try {
    const products = req.body;
    const insertedProducts = await Product.insertMany(products);
    res.status(201).json(insertedProducts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.delete('/deleteAll', async (req, res) => {
  try {
    await Product.deleteMany({});
    res.status(200).json({ message: 'All products deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting products', error });
  }
});

export default router;


