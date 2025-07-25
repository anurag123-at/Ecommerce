import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  image: String
});

const Product = mongoose.model('Product', productSchema);
export default Product;
