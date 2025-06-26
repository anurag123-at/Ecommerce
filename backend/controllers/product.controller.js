import Product from '../models/Product.js';

export const addProduct = async (req, res) => {
  try {
    const { name, description, price, image, rating } = req.body;

    const newProduct = new Product({
      name,
      description,
      price,
      image,
      rating
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add product', error: error.message });
  }
};
