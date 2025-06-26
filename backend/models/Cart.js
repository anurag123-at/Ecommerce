// models/Cart.js
import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  name: String,
  price: Number,
  image: String
});


const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
